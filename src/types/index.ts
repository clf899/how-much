export interface Service {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  nationalAverage: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface Location {
  zipCode: string;
  city: string;
  state: string;
  region: string;
}

export interface PriceData {
  id: string;
  serviceId: string;
  location: Location;
  price: number;
  date: string;
  description?: string;
  receipt?: string;
}

export interface ServicePriceSummary {
  serviceId: string;
  location: Location;
  nationalAverage: number;
  localAverage: number;
  priceRange: {
    min: number;
    max: number;
  };
  dataPoints: number;
  trend: 'up' | 'down' | 'stable';
  yearOverYearChange: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
} 