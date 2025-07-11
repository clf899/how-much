import { getServices, getServiceById, getServicesByCategory, submitPrice, getPriceDataByServiceAndLocation, getPriceSummary, getServiceCategories } from './database'
import { services as mockServices, serviceCategories as mockCategories, mockPriceData, mockPriceSummaries } from '../data/services'
import type { Service, PriceData, ServicePriceSummary, Location } from '../types'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
}

// Services with fallback to mock data
export const getServicesWithFallback = async (): Promise<Service[]> => {
  if (isSupabaseConfigured()) {
    try {
      return await getServices()
    } catch (error) {
      console.warn('Database unavailable, using mock data:', error)
    }
  }
  return mockServices
}

export const getServiceByIdWithFallback = async (id: string): Promise<Service | null> => {
  if (isSupabaseConfigured()) {
    try {
      return await getServiceById(id)
    } catch (error) {
      console.warn('Database unavailable, using mock data:', error)
    }
  }
  return mockServices.find(service => service.id === id) || null
}

export const getServicesByCategoryWithFallback = async (category: string): Promise<Service[]> => {
  if (isSupabaseConfigured()) {
    try {
      return await getServicesByCategory(category)
    } catch (error) {
      console.warn('Database unavailable, using mock data:', error)
    }
  }
  return mockServices.filter(service => service.category === category)
}

export const getServiceCategoriesWithFallback = async (): Promise<{ id: string; name: string; services: Service[] }[]> => {
  if (isSupabaseConfigured()) {
    try {
      return await getServiceCategories()
    } catch (error) {
      console.warn('Database unavailable, using mock data:', error)
    }
  }
  return mockCategories
}

// Price submissions with fallback
export const submitPriceWithFallback = async (priceData: {
  serviceId: string
  price: number
  location: Location
  description?: string
  serviceDate: string
}): Promise<boolean> => {
  if (isSupabaseConfigured()) {
    try {
      return await submitPrice(priceData)
    } catch (error) {
      console.warn('Database unavailable, price submission failed:', error)
      return false
    }
  }
  
  // In mock mode, just show success message
  console.log('Mock mode: Price submitted successfully', priceData)
  return true
}

export const getPriceDataByServiceAndLocationWithFallback = async (
  serviceId: string, 
  location: string
): Promise<PriceData[]> => {
  if (isSupabaseConfigured()) {
    try {
      return await getPriceDataByServiceAndLocation(serviceId, location)
    } catch (error) {
      console.warn('Database unavailable, using mock data:', error)
    }
  }
  
  return mockPriceData.filter(data => 
    data.serviceId === serviceId && 
    (data.location.zipCode === location || data.location.city.toLowerCase().includes(location.toLowerCase()))
  )
}

export const getPriceSummaryWithFallback = async (
  serviceId: string, 
  location: string
): Promise<ServicePriceSummary | null> => {
  if (isSupabaseConfigured()) {
    try {
      return await getPriceSummary(serviceId, location)
    } catch (error) {
      console.warn('Database unavailable, using mock data:', error)
    }
  }
  
  return mockPriceSummaries.find(summary => 
    summary.serviceId === serviceId && 
    (summary.location.zipCode === location || summary.location.city.toLowerCase().includes(location.toLowerCase()))
  ) || null
} 