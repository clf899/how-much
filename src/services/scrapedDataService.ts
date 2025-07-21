import { PriceData, Service, ServicePriceSummary } from '../types'
import { scrapeServicePricing, scrapeSingleSource } from './webScraper'
import { getPriceDataByServiceAndLocation, getPriceSummary } from '../data/services'
import { supabase } from '../lib/supabase'

export class ScrapedDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTimeout = 60 * 60 * 1000 // 1 hour cache for scraped data

  // Get comprehensive pricing data from all sources
  async getComprehensivePricing(
    serviceId: string, 
    location: string
  ): Promise<{
    scrapedData: PriceData[]
    localData: PriceData[]
    databaseData: PriceData[]
    combinedData: PriceData[]
    summary: ServicePriceSummary | null
  }> {
    try {
      // Get data from multiple sources in parallel
      const [scrapedData, localData, databaseData] = await Promise.allSettled([
        this.getScrapedData(serviceId, location),
        this.getLocalData(serviceId, location),
        this.getDatabaseData(serviceId, location)
      ])

      const scraped = scrapedData.status === 'fulfilled' ? scrapedData.value : []
      const local = localData.status === 'fulfilled' ? localData.value : []
      const database = databaseData.status === 'fulfilled' ? databaseData.value : []

      // Combine all data sources
      const combinedData = [...scraped, ...local, ...database]
      
      // Save scraped data to database for future use
      if (scraped.length > 0) {
        await this.saveScrapedDataToDatabase(scraped)
      }
      
      // Generate summary from combined data
      const summary = this.generateSummary(combinedData, serviceId, location)

      return {
        scrapedData: scraped,
        localData: local,
        databaseData: database,
        combinedData,
        summary
      }
    } catch (error) {
      console.error('Error getting comprehensive pricing:', error)
      return {
        scrapedData: [],
        localData: [],
        databaseData: [],
        combinedData: [],
        summary: null
      }
    }
  }

  // Get data from web scraping
  private async getScrapedData(serviceId: string, location: string): Promise<PriceData[]> {
    const cacheKey = `scraped_${serviceId}_${location}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const result = await scrapeServicePricing(serviceId, location)
      const data = result.combinedData
      
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('Error fetching scraped data:', error)
      return []
    }
  }

  // Get data from local mock data
  private async getLocalData(serviceId: string, location: string): Promise<PriceData[]> {
    return getPriceDataByServiceAndLocation(serviceId, location)
  }

  // Get data from Supabase database
  private async getDatabaseData(serviceId: string, location: string): Promise<PriceData[]> {
    try {
      const { data, error } = await supabase
        .from('price_submissions')
        .select('*')
        .eq('service_id', serviceId)
        .ilike('location', `%${location}%`)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Database error:', error)
        return []
      }

      return data?.map(item => ({
        id: item.id,
        serviceId: item.service_id,
        location: {
          zipCode: item.zip_code || '',
          city: item.city || '',
          state: item.state || '',
          region: item.region || ''
        },
        price: item.price,
        date: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        description: item.description || 'User-submitted price'
      })) || []
    } catch (error) {
      console.error('Error fetching database data:', error)
      return []
    }
  }

  // Save scraped data to database
  private async saveScrapedDataToDatabase(scrapedData: PriceData[]): Promise<void> {
    try {
      const dataToInsert = scrapedData.map(item => ({
        service_id: item.serviceId,
        price: item.price,
        location: `${item.location.city}, ${item.location.state}`,
        zip_code: item.location.zipCode,
        city: item.location.city,
        state: item.location.state,
        region: item.location.region,
        description: item.description,
        source: 'web_scraper',
        created_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('price_submissions')
        .insert(dataToInsert)

      if (error) {
        console.error('Error saving scraped data:', error)
      } else {
        console.log(`Saved ${dataToInsert.length} scraped prices to database`)
      }
    } catch (error) {
      console.error('Error saving scraped data to database:', error)
    }
  }

  // Generate price summary from combined data
  private generateSummary(
    data: PriceData[], 
    serviceId: string, 
    location: string
  ): ServicePriceSummary | null {
    if (data.length === 0) return null

    const prices = data.map(item => item.price).filter(price => price > 0)
    if (prices.length === 0) return null

    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    // Calculate trend (simple implementation)
    const recentPrices = data
      .filter(item => {
        const itemDate = new Date(item.date)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return itemDate > thirtyDaysAgo
      })
      .map(item => item.price)

    const olderPrices = data
      .filter(item => {
        const itemDate = new Date(item.date)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return itemDate <= thirtyDaysAgo
      })
      .map(item => item.price)

    let trend: 'up' | 'down' | 'stable' = 'stable'
    let yearOverYearChange = 0

    if (recentPrices.length > 0 && olderPrices.length > 0) {
      const recentAvg = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length
      const olderAvg = olderPrices.reduce((sum, price) => sum + price, 0) / olderPrices.length
      
      if (olderAvg > 0) {
        yearOverYearChange = ((recentAvg - olderAvg) / olderAvg) * 100
        trend = yearOverYearChange > 5 ? 'up' : yearOverYearChange < -5 ? 'down' : 'stable'
      }
    }

    return {
      serviceId,
      location: this.parseLocation(location),
      nationalAverage: average,
      localAverage: average,
      priceRange: { min, max },
      dataPoints: data.length,
      trend,
      yearOverYearChange
    }
  }

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

  // Scrape data for a specific service and location
  async scrapeAndSave(serviceId: string, location: string): Promise<{
    success: boolean
    dataCount: number
    message: string
  }> {
    try {
      console.log(`🕷️  Scraping data for ${serviceId} in ${location}...`)
      
      const result = await scrapeServicePricing(serviceId, location)
      
      if (result.combinedData.length > 0) {
        await this.saveScrapedDataToDatabase(result.combinedData)
        
        return {
          success: true,
          dataCount: result.combinedData.length,
          message: `Successfully scraped ${result.combinedData.length} prices from ${result.summary.successfulSources} sources`
        }
      } else {
        return {
          success: false,
          dataCount: 0,
          message: 'No pricing data found from web scraping'
        }
      }
    } catch (error) {
      console.error('Error scraping and saving data:', error)
      return {
        success: false,
        dataCount: 0,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get data source statistics
  async getDataSourceStats(): Promise<{
    totalSubmissions: number
    scrapedData: number
    userSubmissions: number
    lastUpdated: string
  }> {
    try {
      const { data, error } = await supabase
        .from('price_submissions')
        .select('*')

      if (error) {
        throw error
      }

      const scrapedData = data?.filter(item => item.source === 'web_scraper').length || 0
      const userSubmissions = data?.filter(item => item.source !== 'web_scraper').length || 0
      const totalSubmissions = data?.length || 0

      const lastUpdated = data && data.length > 0 
        ? new Date(Math.max(...data.map(item => new Date(item.created_at).getTime()))).toISOString()
        : new Date().toISOString()

      return {
        totalSubmissions,
        scrapedData,
        userSubmissions,
        lastUpdated
      }
    } catch (error) {
      console.error('Error getting data source stats:', error)
      return {
        totalSubmissions: 0,
        scrapedData: 0,
        userSubmissions: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const scrapedDataService = new ScrapedDataService() 