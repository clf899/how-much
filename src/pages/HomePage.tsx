import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, MapPin } from 'lucide-react'
import { getServiceCategoriesWithFallback, getServicesWithFallback } from '../services/dataService'
import type { Service } from '../types'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [serviceCategories, setServiceCategories] = useState<{ id: string; name: string; services: Service[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          getServicesWithFallback(),
          getServiceCategoriesWithFallback()
        ])
        setServices(servicesData)
        setServiceCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredServices = searchTerm 
    ? services.filter(service => service.category === searchTerm)
    : services

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          How Much Should You Pay?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Check average prices for junk removal, lawn care, house cleaning, and more in your area. 
          Get transparent pricing to make informed decisions.
        </p>
      </div>

      {/* Service Selection Section */}
      <div className="card max-w-2xl mx-auto">
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
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Select service category
            </label>
            <select
              id="serviceCategory"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            >
              <option value="">Choose a service category</option>
              <option value="cleaning">🧹 Cleaning Services</option>
              <option value="landscaping">🌱 Landscaping</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="seasonal">❄️ Seasonal Services</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm ? `${serviceCategories.find(cat => cat.id === searchTerm)?.name || 'Services'}` : 'Popular Service Categories'}
          </h2>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to all categories
            </button>
          )}
        </div>
        
        {searchTerm ? (
          // Show filtered services for selected category
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                to={`/service/${service.id}`}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <p className="text-sm font-medium text-primary-600 mt-1">
                      ${service.nationalAverage} average
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Show all categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <div key={category.id} className="card hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category.name}</h3>
                <div className="space-y-2">
                  {category.services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/service/${service.id}`}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl">{service.icon}</span>
                      <span className="text-gray-700">{service.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">8+</div>
          <div className="text-gray-600">Service Categories</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">50+</div>
          <div className="text-gray-600">Cities Covered</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">1,000+</div>
          <div className="text-gray-600">Price Reports</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Help others by sharing your experience
          </h3>
          <p className="text-gray-600">
            Submit the price you paid for a service to help others make informed decisions.
          </p>
          <Link to="/submit-price" className="btn-primary inline-flex items-center space-x-2">
            <TrendingUp size={18} />
            <span>Submit a Price</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage 