const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">About How Much</h1>
        <p className="text-xl text-gray-600">
          Empowering homeowners with transparent pricing information
        </p>
      </div>

      {/* Mission */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          How Much was created to bring transparency to the home services market. 
          We believe that everyone deserves access to fair, accurate pricing information when hiring 
          professionals for their homes. By crowdsourcing price data from real customers, we help 
          homeowners make informed decisions and avoid overpaying for essential services.
        </p>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Search Services</h3>
            <p className="text-gray-600 text-sm">
              Browse our comprehensive list of home services, from junk removal to lawn care.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Check Local Prices</h3>
            <p className="text-gray-600 text-sm">
              Enter your location to see average prices and price ranges in your area.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Make Informed Decisions</h3>
            <p className="text-gray-600 text-sm">
              Compare prices, read descriptions, and choose the best service for your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Services Covered */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Services We Cover</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Cleaning Services</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Junk Removal</li>
              <li>• House Cleaning</li>
              <li>• Window Cleaning</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Landscaping</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Lawn Mowing</li>
              <li>• Landscaping</li>
              <li>• Tree Services</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Maintenance</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Plumbing</li>
              <li>• Handyman Services</li>
              <li>• Pest Control</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Seasonal</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Snow Removal</li>
              <li>• Gutter Cleaning</li>
              <li>• HVAC Services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Privacy */}
      <div className="card bg-green-50 border-green-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Privacy</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            We take your privacy seriously. All price submissions are anonymous and we never collect 
            personal information beyond what's necessary to provide accurate pricing data.
          </p>
          <p>
            Our data is aggregated to provide average prices and ranges, ensuring individual 
            submissions remain private while still contributing to the community knowledge base.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-700 mb-4">
          Have questions, suggestions, or feedback? We'd love to hear from you!
        </p>
        <div className="space-y-2 text-gray-600">
          <p>📧 Email: contact@homeservicepricechecker.com</p>
          <p>📱 Phone: (555) 123-4567</p>
          <p>🏢 Address: 123 Service Ave, Pricing City, PC 12345</p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage 