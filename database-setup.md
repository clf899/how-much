# Database Setup Guide for How Much

## 🚀 Quick Start - Supabase (Recommended)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### Step 2: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 3: Create Database Schema
```sql
-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  icon VARCHAR NOT NULL,
  description TEXT,
  national_average DECIMAL(10,2),
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price submissions table
CREATE TABLE price_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  price DECIMAL(10,2) NOT NULL,
  location_zip VARCHAR(10),
  location_city VARCHAR(100),
  location_state VARCHAR(2),
  location_region VARCHAR(50),
  description TEXT,
  service_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample services
INSERT INTO services (name, category, icon, description, national_average, price_range_min, price_range_max) VALUES
('Junk Removal', 'cleaning', '🗑️', 'Professional junk removal and disposal services', 250.00, 150.00, 400.00),
('Lawn Mowing', 'landscaping', '🌱', 'Regular lawn maintenance and grass cutting', 45.00, 25.00, 75.00),
('House Cleaning', 'cleaning', '🧹', 'Professional house cleaning services', 150.00, 100.00, 250.00),
('Pest Control', 'maintenance', '🐜', 'Pest control and extermination services', 200.00, 150.00, 300.00),
('Snow Removal', 'seasonal', '❄️', 'Snow plowing and removal services', 75.00, 50.00, 120.00),
('Plumbing', 'maintenance', '🔧', 'Plumbing repair and installation services', 300.00, 200.00, 500.00),
('Handyman', 'maintenance', '🛠️', 'General handyman and repair services', 100.00, 60.00, 150.00),
('Window Cleaning', 'cleaning', '🪟', 'Professional window cleaning services', 120.00, 80.00, 200.00);
```

### Step 4: Environment Variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Update Application Code
Replace mock data with Supabase client calls.

---

## 🗄️ Alternative Database Options

### **2. MongoDB (NoSQL)**
```bash
npm install mongodb
```
- Good for flexible data structures
- Easy to scale
- Great for document-based data

### **3. PostgreSQL (SQL)**
```bash
npm install pg
```
- Robust and reliable
- ACID compliance
- Great for complex queries

### **4. SQLite (Local)**
```bash
npm install sqlite3
```
- Lightweight and local
- Good for development
- No server setup needed

### **5. Firebase (Google)**
```bash
npm install firebase
```
- Real-time database
- Authentication included
- Easy to set up

---

## 🔧 Implementation Steps

### 1. Choose Your Database
- **Supabase**: Best for quick MVP with real-time features
- **MongoDB**: Good for flexible data structures
- **PostgreSQL**: Best for complex queries and relationships
- **SQLite**: Good for development and simple deployments
- **Firebase**: Best for real-time features and authentication

### 2. Set Up Environment
- Create database
- Set up tables/schema
- Configure environment variables

### 3. Update Application
- Replace mock data functions
- Add database client
- Implement CRUD operations

### 4. Test and Deploy
- Test all functionality
- Deploy database
- Update production environment

---

## 📊 Current Mock Data Structure

The application currently uses this structure in `src/data/services.ts`:

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

interface PriceData {
  id: string;
  serviceId: string;
  location: Location;
  price: number;
  date: string;
  description?: string;
}
```

This can be easily migrated to any database system. 