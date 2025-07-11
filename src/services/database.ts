import { supabase } from '../lib/supabase'
import type { Service, PriceData, ServicePriceSummary, Location } from '../types'

// Services
export const getServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (error) throw error

    return data?.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      icon: service.icon,
      description: service.description,
      nationalAverage: service.national_average,
      priceRange: {
        min: service.price_range_min,
        max: service.price_range_max
      }
    })) || []
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) return null

    return {
      id: data.id,
      name: data.name,
      category: data.category,
      icon: data.icon,
      description: data.description,
      nationalAverage: data.national_average,
      priceRange: {
        min: data.price_range_min,
        max: data.price_range_max
      }
    }
  } catch (error) {
    console.error('Error fetching service:', error)
    return null
  }
}

export const getServicesByCategory = async (category: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .order('name')

    if (error) throw error

    return data?.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      icon: service.icon,
      description: service.description,
      nationalAverage: service.national_average,
      priceRange: {
        min: service.price_range_min,
        max: service.price_range_max
      }
    })) || []
  } catch (error) {
    console.error('Error fetching services by category:', error)
    return []
  }
}

// Price Submissions
export const submitPrice = async (priceData: {
  serviceId: string
  price: number
  location: Location
  description?: string
  serviceDate: string
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('price_submissions')
      .insert({
        service_id: priceData.serviceId,
        price: priceData.price,
        location_zip: priceData.location.zipCode,
        location_city: priceData.location.city,
        location_state: priceData.location.state,
        location_region: priceData.location.region,
        description: priceData.description,
        service_date: priceData.serviceDate
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error submitting price:', error)
    return false
  }
}

export const getPriceDataByServiceAndLocation = async (
  serviceId: string, 
  location: string
): Promise<PriceData[]> => {
  try {
    const { data, error } = await supabase
      .from('price_submissions')
      .select(`
        *,
        services (
          id,
          name,
          icon
        )
      `)
      .eq('service_id', serviceId)
      .or(`location_zip.eq.${location},location_city.ilike.%${location}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(submission => ({
      id: submission.id,
      serviceId: submission.service_id,
      price: submission.price,
      location: {
        zipCode: submission.location_zip || '',
        city: submission.location_city || '',
        state: submission.location_state || '',
        region: submission.location_region || ''
      },
      date: submission.service_date || submission.created_at,
      description: submission.description
    })) || []
  } catch (error) {
    console.error('Error fetching price data:', error)
    return []
  }
}

// Price Summaries
export const getPriceSummary = async (
  serviceId: string, 
  location: string
): Promise<ServicePriceSummary | null> => {
  try {
    // Get price data for the service and location
    const priceData = await getPriceDataByServiceAndLocation(serviceId, location)
    
    if (priceData.length === 0) return null

    // Calculate local average
    const localPrices = priceData.map(p => p.price)
    const localAverage = localPrices.reduce((sum, price) => sum + price, 0) / localPrices.length

    // Get service for national average
    const service = await getServiceById(serviceId)
    if (!service) return null

    // Calculate price range
    const minPrice = Math.min(...localPrices)
    const maxPrice = Math.max(...localPrices)

    // Simple trend calculation (comparing recent vs older prices)
    const sortedPrices = priceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const recentPrices = sortedPrices.slice(0, Math.ceil(sortedPrices.length / 2))
    const olderPrices = sortedPrices.slice(Math.ceil(sortedPrices.length / 2))
    
    const recentAverage = recentPrices.reduce((sum, p) => sum + p.price, 0) / recentPrices.length
    const olderAverage = olderPrices.reduce((sum, p) => sum + p.price, 0) / olderPrices.length
    
    const yearOverYearChange = olderPrices.length > 0 
      ? ((recentAverage - olderAverage) / olderAverage) * 100 
      : 0

    const trend = yearOverYearChange > 2 ? 'up' : yearOverYearChange < -2 ? 'down' : 'stable'

    return {
      serviceId,
      location: priceData[0].location,
      nationalAverage: service.nationalAverage,
      localAverage: Math.round(localAverage),
      priceRange: {
        min: Math.round(minPrice),
        max: Math.round(maxPrice)
      },
      dataPoints: priceData.length,
      trend,
      yearOverYearChange: Math.round(yearOverYearChange * 10) / 10
    }
  } catch (error) {
    console.error('Error calculating price summary:', error)
    return null
  }
}

// Categories
export const getServiceCategories = async (): Promise<{ id: string; name: string; services: Service[] }[]> => {
  try {
    const services = await getServices()
    
    const categories = [
      { id: 'cleaning', name: 'Cleaning Services' },
      { id: 'landscaping', name: 'Landscaping' },
      { id: 'maintenance', name: 'Maintenance' },
      { id: 'seasonal', name: 'Seasonal Services' }
    ]

    return categories.map(category => ({
      ...category,
      services: services.filter(service => service.category === category.id)
    }))
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return []
  }
} 