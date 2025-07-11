import { useState, useEffect } from 'react'
import { Upload, MapPin, DollarSign, Calendar } from 'lucide-react'
import { getServicesWithFallback, submitPriceWithFallback } from '../services/dataService'
import type { Service } from '../types'

const SubmitPricePage = () => {
  const [formData, setFormData] = useState({
    serviceId: '',
    price: '',
    location: '',
    date: '',
    description: ''
  })
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await getServicesWithFallback()
        setServices(servicesData)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedService = services.find(s => s.id === formData.serviceId)
    if (!selectedService) {
      alert('Please select a valid service')
      return
    }

    const locationParts = formData.location.split(',').map(part => part.trim())
    const location = {
      zipCode: locationParts[0] || '',
      city: locationParts[1] || locationParts[0] || '',
      state: locationParts[2] || '',
      region: ''
    }

    const success = await submitPriceWithFallback({
      serviceId: formData.serviceId,
      price: parseFloat(formData.price),
      location,
      description: formData.description,
      serviceDate: formData.date
    })

    if (success) {
      alert('Thank you for submitting your price! This helps others make informed decisions.')
      setFormData({
        serviceId: '',
        price: '',
        location: '',
        date: '',
        description: ''
      })
    } else {
      alert('Failed to submit price. Please try again.')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Submit a Price</h1>
        <p className="text-gray-600">
          Help others by sharing what you paid for a home service. Your contribution helps create 
          transparent pricing for everyone.
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              id="service"
              value={formData.serviceId}
              onChange={(e) => handleInputChange('serviceId', e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.icon} {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price Paid *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                id="price"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="input-field pl-10"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="location"
                placeholder="ZIP code or city name"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Service Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Describe the service details, size of job, etc."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Upload size={18} />
            <span>Submit Price</span>
          </button>
        </form>
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Submit Prices?</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Help others make informed decisions about home services</p>
          <p>• Contribute to transparent pricing in your community</p>
          <p>• All submissions are anonymous and secure</p>
          <p>• Your data helps identify fair market rates</p>
        </div>
      </div>
    </div>
  )
}

export default SubmitPricePage 