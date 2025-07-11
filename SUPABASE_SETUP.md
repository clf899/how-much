# 🚀 Supabase Setup Guide for How Much

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `how-much`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the tables:

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

## Step 4: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Try submitting a price - it should now save to your database!

## Step 5: View Your Data

1. In Supabase dashboard, go to **Table Editor**
2. You can see your `services` and `price_submissions` tables
3. All new price submissions will appear here

## 🔧 Troubleshooting

### "Database unavailable, using mock data"
- Check your `.env.local` file has correct values
- Make sure your Supabase project is active
- Verify your API keys are correct

### "Failed to submit price"
- Check the browser console for errors
- Verify your database schema is set up correctly
- Make sure your Supabase project has the correct tables

### Environment Variables Not Loading
- Make sure your `.env.local` file is in the project root
- Restart your development server after adding environment variables
- Check that variable names start with `VITE_`

## 🎯 Next Steps

Once your database is working:

1. **Add Authentication**: Enable user accounts in Supabase
2. **Add Real-time Features**: Enable real-time subscriptions
3. **Add Analytics**: Set up database analytics
4. **Deploy**: Deploy your app with the database

## 📊 Database Schema Overview

### Services Table
- `id`: Unique identifier
- `name`: Service name (e.g., "Junk Removal")
- `category`: Service category (e.g., "cleaning")
- `icon`: Emoji icon
- `description`: Service description
- `national_average`: National average price
- `price_range_min/max`: Typical price range

### Price Submissions Table
- `id`: Unique identifier
- `service_id`: Reference to services table
- `price`: Submitted price
- `location_*`: Location information
- `description`: Optional description
- `service_date`: When the service was performed
- `created_at`: When the submission was made

---

**🎉 Your How Much app now has a real database!** 