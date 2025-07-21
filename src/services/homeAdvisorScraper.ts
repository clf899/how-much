import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import { PriceData } from '../types'

interface HomeAdvisorPricing {
  service: string
  averageCost: number
  costRange: { min: number; max: number }
  description: string
  factors: string[]
}

class HomeAdvisorScraper {
  private browser: puppeteer.Browser | null = null
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      })
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  // Scrape HomeAdvisor cost guide for a specific service
  async scrapeCostGuide(service: string): Promise<{
    success: boolean
    data: PriceData[]
    pricing: HomeAdvisorPricing | null
    error?: string
  }> {
    try {
      await this.initialize()

      const page = await this.browser!.newPage()
      await page.setUserAgent(this.userAgent)
      await page.setViewport({ width: 1920, height: 1080 })

      // Navigate to HomeAdvisor cost guide
      const serviceSlug = this.getServiceSlug(service)
      const url = `https://www.homeadvisor.com/cost/${serviceSlug}/`
      
      console.log(`🕷️  Scraping HomeAdvisor: ${url}`)
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

      // Wait for key elements to load
      await page.waitForSelector('body', { timeout: 15000 }).catch(() => {})

      const content = await page.content()
      const $ = cheerio.load(content)

      const prices: PriceData[] = []
      const pricing: HomeAdvisorPricing | null = this.extractPricingInfo($, service)

      // Extract prices from various elements
      const priceElements = $('[class*="cost"], [class*="price"], .project-cost, .service-cost, .average-cost')
      
      priceElements.each((index, element) => {
        const priceText = $(element).text().trim()
        const extractedPrices = this.extractPricesFromText(priceText)
        
                 extractedPrices.forEach((price, priceIndex) => {
           if (price >= 10 && price < 50000) { // Minimum $10 for realistic pricing
             prices.push({
               id: `homeadvisor_${service}_${index}_${priceIndex}`,
               serviceId: service,
               location: { zipCode: '', city: '', state: '', region: 'National' },
               price,
               date: new Date().toISOString().split('T')[0],
               description: `${service} service from HomeAdvisor cost guide`
             })
           }
         })
      })

      // Extract from cost ranges
      const costRanges = $('.cost-range, .price-range, [class*="range"]')
      costRanges.each((index, element) => {
        const rangeText = $(element).text().trim()
        const range = this.extractPriceRange(rangeText)
        
        if (range.min > 0 && range.max > range.min) {
          // Add min and max as separate data points
          prices.push({
            id: `homeadvisor_range_min_${service}_${index}`,
            serviceId: service,
            location: { zipCode: '', city: '', state: '', region: 'National' },
            price: range.min,
            date: new Date().toISOString().split('T')[0],
            description: `${service} service - minimum cost from HomeAdvisor`
          })
          
          prices.push({
            id: `homeadvisor_range_max_${service}_${index}`,
            serviceId: service,
            location: { zipCode: '', city: '', state: '', region: 'National' },
            price: range.max,
            date: new Date().toISOString().split('T')[0],
            description: `${service} service - maximum cost from HomeAdvisor`
          })
        }
      })

      // Extract from text content
      const bodyText = $('body').text()
      const allPriceMatches = bodyText.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g)
      
             if (allPriceMatches) {
         allPriceMatches.forEach((match, index) => {
           const price = parseFloat(match.replace(/[$,]/g, ''))
           if (price >= 10 && price < 50000) { // Minimum $10 for realistic pricing
             prices.push({
               id: `homeadvisor_text_${service}_${index}`,
               serviceId: service,
               location: { zipCode: '', city: '', state: '', region: 'National' },
               price,
               date: new Date().toISOString().split('T')[0],
               description: `${service} service from HomeAdvisor (text extraction)`
             })
           }
         })
       }

      await page.close()

      console.log(`✅ Found ${prices.length} pricing data points from HomeAdvisor`)

      return {
        success: true,
        data: prices,
        pricing
      }

    } catch (error) {
      console.error('HomeAdvisor scraping error:', error)
      return {
        success: false,
        data: [],
        pricing: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Extract structured pricing information
  private extractPricingInfo($: cheerio.CheerioAPI, service: string): HomeAdvisorPricing | null {
    try {
      // Look for average cost
      const averageCostText = $('[class*="average"], [class*="typical"], .cost-average').first().text()
      const averageCost = this.extractPrice(averageCostText)

      // Look for cost range
      const costRangeText = $('[class*="range"], [class*="between"]').first().text()
      const costRange = this.extractPriceRange(costRangeText)

      // Look for description
      const description = $('[class*="description"], [class*="summary"]').first().text().trim()

      // Look for cost factors
      const factors: string[] = []
      $('[class*="factor"], [class*="consideration"]').each((index, element) => {
        const factor = $(element).text().trim()
        if (factor && factor.length > 10) {
          factors.push(factor)
        }
      })

      if (averageCost > 0 || costRange.min > 0) {
        return {
          service,
          averageCost: averageCost || (costRange.min + costRange.max) / 2,
          costRange,
          description: description || `${service} service pricing`,
          factors: factors.slice(0, 5) // Limit to 5 factors
        }
      }

      return null
    } catch (error) {
      console.error('Error extracting pricing info:', error)
      return null
    }
  }

  // Extract multiple prices from text
  private extractPricesFromText(text: string): number[] {
    const prices: number[] = []
    const priceMatches = text.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g)
    
         if (priceMatches) {
       priceMatches.forEach(match => {
         const price = parseFloat(match.replace(/[$,]/g, ''))
         if (price >= 10 && price < 50000) { // Minimum $10 for realistic pricing
           prices.push(price)
         }
       })
     }

    return prices
  }

  // Extract price range from text
  private extractPriceRange(text: string): { min: number; max: number } {
    const rangeMatch = text.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*-\s*\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i)
    
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1].replace(/,/g, ''))
      const max = parseFloat(rangeMatch[2].replace(/,/g, ''))
      return { min, max }
    }

    // Try alternative patterns
    const numbers = text.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g)
    if (numbers && numbers.length >= 2) {
      const prices = numbers.map(n => parseFloat(n.replace(/[$,]/g, ''))).filter(p => p > 0)
      if (prices.length >= 2) {
        return { min: Math.min(...prices), max: Math.max(...prices) }
      }
    }

    return { min: 0, max: 0 }
  }

  // Extract single price from text
  private extractPrice(text: string): number {
    const priceMatch = text.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/)
    if (priceMatch) {
      return parseFloat(priceMatch[1].replace(/,/g, ''))
    }
    return 0
  }

  // Convert service name to HomeAdvisor URL slug
  private getServiceSlug(service: string): string {
    const serviceMap: { [key: string]: string } = {
      'junk-removal': 'junk-removal',
      'lawn-mowing': 'lawn-care',
      'house-cleaning': 'house-cleaning',
      'pest-control': 'pest-control',
      'snow-removal': 'snow-removal',
      'plumbing': 'plumbing',
      'handyman': 'handyman',
      'window-cleaning': 'window-cleaning',
      'landscaping': 'landscaping',
      'cleaning': 'house-cleaning',
      'maintenance': 'handyman',
      'seasonal': 'snow-removal'
    }

    return serviceMap[service] || service.replace(/-/g, '-')
  }

  // Scrape multiple services
  async scrapeMultipleServices(services: string[]): Promise<{
    [service: string]: {
      success: boolean
      data: PriceData[]
      pricing: HomeAdvisorPricing | null
      error?: string
    }
  }> {
    const results: { [service: string]: any } = {}

    for (const service of services) {
      console.log(`\n🕷️  Scraping ${service}...`)
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = await this.scrapeCostGuide(service)
      results[service] = result
    }

    return results
  }
}

// Export singleton instance
export const homeAdvisorScraper = new HomeAdvisorScraper()

// Helper functions
export const scrapeHomeAdvisorService = async (service: string) => {
  return await homeAdvisorScraper.scrapeCostGuide(service)
}

export const scrapeHomeAdvisorServices = async (services: string[]) => {
  return await homeAdvisorScraper.scrapeMultipleServices(services)
} 