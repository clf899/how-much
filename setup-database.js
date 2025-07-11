#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Setting up database for How Much...\n');

console.log('📋 Step 1: Create Supabase Project');
console.log('1. Go to https://supabase.com');
console.log('2. Sign up or log in');
console.log('3. Click "New Project"');
console.log('4. Name it "how-much"');
console.log('5. Choose a region close to you');
console.log('6. Set a database password');
console.log('7. Click "Create new project"\n');

console.log('📋 Step 2: Get Your API Keys');
console.log('1. In your Supabase dashboard, go to Settings → API');
console.log('2. Copy the "Project URL" and "anon public" key\n');

rl.question('Enter your Supabase Project URL: ', (projectUrl) => {
  rl.question('Enter your Supabase anon key: ', (anonKey) => {
    // Create .env.local file
    const envContent = `VITE_SUPABASE_URL=${projectUrl}
VITE_SUPABASE_ANON_KEY=${anonKey}`;

    fs.writeFileSync('.env.local', envContent);
    
    console.log('\n✅ Created .env.local file with your credentials');
    console.log('\n📋 Step 3: Set Up Database Schema');
    console.log('1. In Supabase dashboard, go to SQL Editor');
    console.log('2. Copy and paste this SQL:');
    
    const sqlSchema = `
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
('Window Cleaning', 'cleaning', '🪟', 'Professional window cleaning services', 120.00, 80.00, 200.00);`;

    console.log(sqlSchema);
    console.log('\n3. Click "Run" to create the tables');
    console.log('\n📋 Step 4: Test Your Setup');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Try submitting a price - it should save to your database!');
    
    rl.close();
  });
}); 