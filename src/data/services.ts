import { Service, ServiceCategory, PriceData, ServicePriceSummary } from '../types'

export const services: Service[] = [
  {
    id: 'junk-removal',
    name: 'Junk Removal',
    category: 'cleaning',
    icon: '🗑️',
    description: 'Professional junk removal and disposal services',
    nationalAverage: 250,
    priceRange: { min: 150, max: 400 }
  },
  {
    id: 'lawn-mowing',
    name: 'Lawn Mowing',
    category: 'landscaping',
    icon: '🌱',
    description: 'Regular lawn maintenance and grass cutting',
    nationalAverage: 45,
    priceRange: { min: 25, max: 75 }
  },
  {
    id: 'house-cleaning',
    name: 'House Cleaning',
    category: 'cleaning',
    icon: '🧹',
    description: 'Professional house cleaning services',
    nationalAverage: 150,
    priceRange: { min: 100, max: 250 }
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    category: 'maintenance',
    icon: '🐜',
    description: 'Pest control and extermination services',
    nationalAverage: 200,
    priceRange: { min: 150, max: 300 }
  },
  {
    id: 'snow-removal',
    name: 'Snow Removal',
    category: 'seasonal',
    icon: '❄️',
    description: 'Snow plowing and removal services',
    nationalAverage: 75,
    priceRange: { min: 50, max: 120 }
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    category: 'maintenance',
    icon: '🚰',
    description: 'Plumbing repair and installation services',
    nationalAverage: 300,
    priceRange: { min: 200, max: 500 }
  },
  {
    id: 'handyman',
    name: 'Handyman',
    category: 'maintenance',
    icon: '🛠️',
    description: 'General handyman and repair services',
    nationalAverage: 100,
    priceRange: { min: 60, max: 150 }
  },
  {
    id: 'window-cleaning',
    name: 'Window Cleaning',
    category: 'cleaning',
    icon: '🪟',
    description: 'Professional window cleaning services',
    nationalAverage: 120,
    priceRange: { min: 80, max: 200 }
  }
]

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    services: services.filter(s => s.category === 'cleaning')
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    services: services.filter(s => s.category === 'landscaping')
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    services: services.filter(s => s.category === 'maintenance')
  },
  {
    id: 'seasonal',
    name: 'Seasonal Services',
    services: services.filter(s => s.category === 'seasonal')
  }
]

// Mock price data for different locations
export const mockPriceData: PriceData[] = [
  {
    id: '1',
    serviceId: 'junk-removal',
    location: { zipCode: '10001', city: 'New York', state: 'NY', region: 'Northeast' },
    price: 300,
    date: '2024-01-15',
    description: 'Full truck load of furniture and appliances'
  },
  {
    id: '2',
    serviceId: 'junk-removal',
    location: { zipCode: '10001', city: 'New York', state: 'NY', region: 'Northeast' },
    price: 250,
    date: '2024-01-10',
    description: 'Half truck load of household items'
  },
  {
    id: '3',
    serviceId: 'lawn-mowing',
    location: { zipCode: '90210', city: 'Beverly Hills', state: 'CA', region: 'West' },
    price: 60,
    date: '2024-01-12',
    description: 'Standard lawn maintenance'
  },
  {
    id: '4',
    serviceId: 'house-cleaning',
    location: { zipCode: '33101', city: 'Miami', state: 'FL', region: 'Southeast' },
    price: 180,
    date: '2024-01-08',
    description: 'Deep cleaning service'
  }
]

// Mock price summaries
export const mockPriceSummaries: ServicePriceSummary[] = [
  {
    serviceId: 'junk-removal',
    location: { zipCode: '10001', city: 'New York', state: 'NY', region: 'Northeast' },
    nationalAverage: 250,
    localAverage: 275,
    priceRange: { min: 200, max: 350 },
    dataPoints: 15,
    trend: 'up',
    yearOverYearChange: 8.5
  },
  {
    serviceId: 'lawn-mowing',
    location: { zipCode: '90210', city: 'Beverly Hills', state: 'CA', region: 'West' },
    nationalAverage: 45,
    localAverage: 55,
    priceRange: { min: 40, max: 75 },
    dataPoints: 23,
    trend: 'stable',
    yearOverYearChange: 2.1
  }
]

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id)
}

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category)
}

export const getPriceDataByServiceAndLocation = (serviceId: string, location: string): PriceData[] => {
  return mockPriceData.filter(data => 
    data.serviceId === serviceId && 
    (data.location.zipCode === location || data.location.city.toLowerCase().includes(location.toLowerCase()))
  )
}

export const getPriceSummary = (serviceId: string, location: string): ServicePriceSummary | undefined => {
  return mockPriceSummaries.find(summary => 
    summary.serviceId === serviceId && 
    (summary.location.zipCode === location || summary.location.city.toLowerCase().includes(location.toLowerCase()))
  )
} 