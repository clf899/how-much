# 💰 How Much - Home Service Price Checker

A modern web application that helps homeowners find fair prices for home services like junk removal, lawn care, house cleaning, and more. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

### Core MVP Features
- **📍 Location-based Search**: Enter ZIP code or city to find local prices
- **🧹 Service Categories**: 8+ categories including junk removal, lawn care, cleaning, and maintenance
- **📊 Price Summaries**: National averages, local averages, and typical price ranges
- **🗣️ Crowdsourced Data**: Anonymous user submissions for transparent pricing
- **📈 Basic Trends**: Year-over-year price changes and trend indicators
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Service Categories
- **Cleaning Services**: Junk removal, house cleaning, window cleaning
- **Landscaping**: Lawn mowing, landscaping, tree services
- **Maintenance**: Plumbing, handyman, pest control
- **Seasonal**: Snow removal, gutter cleaning, HVAC services

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-service-price-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Recharts**: Data visualization
- **Lucide React**: Icon library

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation header
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── ServicePage.tsx # Service detail page
│   ├── SubmitPricePage.tsx # Price submission form
│   └── AboutPage.tsx   # About page
├── data/               # Mock data and utilities
│   └── services.ts     # Service and price data
├── types/              # TypeScript definitions
│   └── index.ts        # Type interfaces
├── main.tsx            # Application entry point
├── App.tsx             # Main app component
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9) - Main brand color
- **Secondary**: Gray scale for text and backgrounds
- **Success**: Green for positive trends
- **Warning**: Red for negative trends

### Components
- **Cards**: Clean, shadowed containers
- **Buttons**: Primary and secondary styles
- **Inputs**: Consistent form styling
- **Charts**: Responsive data visualization

## 📊 Data Structure

### Services
```typescript
interface Service {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  nationalAverage: number;
  priceRange: { min: number; max: number };
}
```

### Price Data
```typescript
interface PriceData {
  id: string;
  serviceId: string;
  location: Location;
  price: number;
  date: string;
  description?: string;
}
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind CSS for styling

## 🚀 Deployment

### Build Process
1. Run `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure your server to serve `index.html` for all routes

### Environment Variables
Currently using mock data. For production, you'll need:
- API endpoints for data
- Database connection
- Authentication service

## 📈 Roadmap

### Phase 2 (Next)
- [ ] Backend API with real database
- [ ] User authentication and profiles
- [ ] Real-time price updates
- [ ] Advanced analytics and trends
- [ ] Service provider integration

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Direct booking capabilities
- [ ] AI-powered price predictions
- [ ] Service provider marketplace

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: contact@homeservicepricechecker.com
- **Phone**: (555) 123-4567
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vite for the fast build tool
- All contributors and users

---

**Made with ❤️ for transparent home service pricing** 