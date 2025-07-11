import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MapPin, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getServiceByIdWithFallback, getPriceSummaryWithFallback, getPriceDataByServiceAndLocationWithFallback } from '../services/dataService'
import type { Service, ServicePriceSummary, PriceData } from '../types'

const ServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>()
  const [location, setLocation] = useState('')
  
  const [service, setService] = useState<Service | null>(null)
  const [priceSummary, setPriceSummary] = useState<ServicePriceSummary | null>(null)
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServiceData = async () => {
      if (!serviceId) return
      
      try {
        const serviceData = await getServiceByIdWithFallback(serviceId)
        setService(serviceData)
        
        if (location) {
          const [summaryData, priceDataResult] = await Promise.all([
            getPriceSummaryWithFallback(serviceId, location),
            getPriceDataByServiceAndLocationWithFallback(serviceId, location)
          ])
          setPriceSummary(summaryData)
          setPriceData(priceDataResult)
        }
      } catch (error) {
        console.error('Error loading service data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServiceData()
  }, [serviceId, location])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service data...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Service not found</h2>
        <p className="text-gray-600 mt-2">The service you're looking for doesn't exist.</p>
      </div>
    )
  }

  const chartData = priceData.map(data => ({
    date: new Date(data.date).toLocaleDateString(),
    price: data.price
  }))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-600" size={20} />
      case 'down':
        return <TrendingDown className="text-red-600" size={20} />
      default:
        return <Minus className="text-gray-600" size={20} />
    }
  }

  return (
    <div className="space-y-8">
      {/* Service Header */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{service.icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-gray-600">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Location Search */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Check Prices in Your Area</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="location"
                placeholder="ZIP code or city name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      {priceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">
              ${priceSummary.nationalAverage}
            </div>
            <div className="text-gray-600">National Average</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">
              ${priceSummary.localAverage}
            </div>
            <div className="text-gray-600">Local Average</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">
              ${priceSummary.priceRange.min}-${priceSummary.priceRange.max}
            </div>
            <div className="text-gray-600">Typical Range</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center space-x-2">
              {getTrendIcon(priceSummary.trend)}
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {priceSummary.yearOverYearChange > 0 ? '+' : ''}{priceSummary.yearOverYearChange}%
                </div>
                <div className="text-gray-600">YoY Change</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Chart */}
      {priceData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Price History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Price Reports */}
      {priceData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Price Reports</h3>
          <div className="space-y-4">
            {priceData.map((data) => (
              <div key={data.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">${data.price}</div>
                  <div className="text-sm text-gray-600">
                    {data.location.city}, {data.location.state} • {new Date(data.date).toLocaleDateString()}
                  </div>
                  {data.description && (
                    <div className="text-sm text-gray-500 mt-1">{data.description}</div>
                  )}
                </div>
                <div className="text-2xl">{service.icon}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {location && !priceSummary && (
        <div className="card text-center">
          <div className="text-gray-600">
            <p className="mb-4">No price data available for {location} yet.</p>
            <p>Be the first to submit a price for this service in your area!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicePage 