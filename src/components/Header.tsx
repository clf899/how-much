import { Link } from 'react-router-dom'
import { Home, Info, Upload } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">💰</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">How Much</h1>
              <p className="text-sm text-gray-600">Find fair prices for home services</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/submit-price" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Upload size={18} />
              <span>Submit Price</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Info size={18} />
              <span>About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 