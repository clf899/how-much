import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import { PriceData } from '../types'

interface ScrapingConfig {
  rateLimit: number
  userAgent: string
  timeout: number
}

interface ScrapingResult {
  success: boolean
  data: PriceData[]
  error?: string
  source: string
}

class WebScraper {
  private browser: puppeteer.Browser | null = null
  private config: ScrapingConfig
  private lastRequestTime: number = 0

  constructor(config: ScrapingConfig) {
    this.config = config
  }

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

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    const minInterval = 1000 / this.config.rateLimit

    if (timeSinceLastRequest < minInterval) {
      const delay = minInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    this.lastRequestTime = Date.now()
  }

  // Scrape Thumbtack for service pricing
  async scrapeThumbtack(service: string, location: string): Promise<ScrapingResult> {
    try {
      await this.enforceRateLimit()
      await this.initialize()

      const page = await this.browser!.newPage()
      await page.setUserAgent(this.config.userAgent)
      await page.setViewport({ width: 1920, height: 1080 })

      // Navigate to Thumbtack search page
      const searchUrl = `https://www.thumbtack.com/search/${encodeURIComponent(service)}/${encodeURIComponent(location)}`
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: this.config.timeout })

      // Wait for pricing elements to load
      await page.waitForSelector('[data-testid="price"]', { timeout: 10000 }).catch(() => {})

      const content = await page.content()
      const $ = cheerio.load(content)

      const prices: PriceData[] = []
      const priceElements = $('[data-testid="price"], .price, [class*="price"]')

      priceElements.each((index, element) => {
        const priceText = $(element).text().trim()
        const price = this.extractPrice(priceText)
        
        if (price > 0) {
          prices.push({
            id: `thumbtack_${service}_${index}`,
            serviceId: service,
            location: this.parseLocation(location),
            price,
            date: new Date().toISOString().split('T')[0],
            description: `${service} service from Thumbtack`
          })
        }
      })

      await page.close()

      return {
        success: true,
        data: prices,
        source: 'Thumbtack'
      }

    } catch (error) {
      console.error('Thumbtack scraping error:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'Thumbtack'
      }
    }
  }

  // Scrape HomeAdvisor for service pricing
  async scrapeHomeAdvisor(service: string, location: string): Promise<ScrapingResult> {
    try {
      await this.enforceRateLimit()
      await this.initialize()

      const page = await this.browser!.newPage()
      await page.setUserAgent(this.config.userAgent)
      await page.setViewport({ width: 1920, height: 1080 })

      // Navigate to HomeAdvisor
      const searchUrl = `https://www.homeadvisor.com/cost/${encodeURIComponent(service)}/`
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: this.config.timeout })

      const content = await page.content()
      const $ = cheerio.load(content)

      const prices: PriceData[] = []
      const priceElements = $('.cost-range, .price, [class*="cost"], [class*="price"]')

      priceElements.each((index, element) => {
        const priceText = $(element).text().trim()
        const price = this.extractPrice(priceText)
        
        if (price > 0) {
          prices.push({
            id: `homeadvisor_${service}_${index}`,
            serviceId: service,
            location: this.parseLocation(location),
            price,
            date: new Date().toISOString().split('T')[0],
            description: `${service} service from HomeAdvisor`
          })
        }
      })

      await page.close()

      return {
        success: true,
        data: prices,
        source: 'HomeAdvisor'
      }

    } catch (error) {
      console.error('HomeAdvisor scraping error:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'HomeAdvisor'
      }
    }
  }

  // Scrape Angie's List for service pricing
  async scrapeAngiesList(service: string, location: string): Promise<ScrapingResult> {
    try {
      await this.enforceRateLimit()
      await this.initialize()

      const page = await this.browser!.newPage()
      await page.setUserAgent(this.config.userAgent)
      await page.setViewport({ width: 1920, height: 1080 })

      // Navigate to Angie's List
      const searchUrl = `https://www.angi.com/companylist/us/${encodeURIComponent(location)}/${encodeURIComponent(service)}.htm`
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: this.config.timeout })

      const content = await page.content()
      const $ = cheerio.load(content)

      const prices: PriceData[] = []
      const priceElements = $('.price, .cost, [class*="price"], [class*="cost"]')

      priceElements.each((index, element) => {
        const priceText = $(element).text().trim()
        const price = this.extractPrice(priceText)
        
        if (price > 0) {
          prices.push({
            id: `angieslist_${service}_${index}`,
            serviceId: service,
            location: this.parseLocation(location),
            price,
            date: new Date().toISOString().split('T')[0],
            description: `${service} service from Angie's List`
          })
        }
      })

      await page.close()

      return {
        success: true,
        data: prices,
        source: 'Angie\'s List'
      }

    } catch (error) {
      console.error('Angie\'s List scraping error:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'Angie\'s List'
      }
    }
  }

  // Scrape multiple sources for comprehensive data
  async scrapeAllSources(service: string, location: string): Promise<{
    results: ScrapingResult[]
    combinedData: PriceData[]
    summary: {
      totalSources: number
      successfulSources: number
      totalPrices: number
      averagePrice: number
      priceRange: { min: number; max: number }
    }
  }> {
    const sources = [
      () => this.scrapeThumbtack(service, location),
      () => this.scrapeHomeAdvisor(service, location),
      () => this.scrapeAngiesList(service, location)
    ]

    const results = await Promise.allSettled(sources.map(source => source()))

    const successfulResults = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<ScrapingResult>).value)

    const combinedData = successfulResults.flatMap(result => result.data)
    const prices = combinedData.map(item => item.price).filter(price => price > 0)

    const summary = {
      totalSources: sources.length,
      successfulSources: successfulResults.length,
      totalPrices: combinedData.length,
      averagePrice: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      }
    }

    return {
      results: successfulResults,
      combinedData,
      summary
    }
  }

  // Extract price from text
  private extractPrice(text: string): number {
    const priceMatch = text.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/)
    if (priceMatch) {
      return parseFloat(priceMatch[1].replace(/,/g, ''))
    }
    return 0
  }

  // Parse location string
  private parseLocation(locationString: string): { zipCode: string; city: string; state: string; region: string } {
    const parts = locationString.split(', ')
    return {
      zipCode: parts[0] || '',
      city: parts[1] || '',
      state: parts[2] || '',
      region: this.getRegionFromState(parts[2] || '')
    }
  }

  private getRegionFromState(state: string): string {
    const regions: { [key: string]: string } = {
      'NY': 'Northeast', 'MA': 'Northeast', 'PA': 'Northeast', 'NJ': 'Northeast',
      'CA': 'West', 'WA': 'West', 'OR': 'West', 'NV': 'West',
      'TX': 'South', 'FL': 'Southeast', 'GA': 'Southeast', 'NC': 'Southeast',
      'IL': 'Midwest', 'MI': 'Midwest', 'OH': 'Midwest', 'WI': 'Midwest'
    }
    return regions[state] || 'Other'
  }
}

// Create and export scraper instance
const scraperConfig: ScrapingConfig = {
  rateLimit: 2, // 2 requests per second to be respectful
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  timeout: 30000
}

export const webScraper = new WebScraper(scraperConfig)

// Helper functions
export const scrapeServicePricing = async (service: string, location: string) => {
  return await webScraper.scrapeAllSources(service, location)
}

export const scrapeSingleSource = async (source: 'thumbtack' | 'homeadvisor' | 'angieslist', service: string, location: string) => {
  switch (source) {
    case 'thumbtack':
      return await webScraper.scrapeThumbtack(service, location)
    case 'homeadvisor':
      return await webScraper.scrapeHomeAdvisor(service, location)
    case 'angieslist':
      return await webScraper.scrapeAngiesList(service, location)
    default:
      throw new Error(`Unknown source: ${source}`)
  }
} 