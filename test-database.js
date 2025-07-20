#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testing Database Connection...\n')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Environment variables not found!')
  console.log('Make sure .env.local exists with:')
  console.log('VITE_SUPABASE_URL=your_url')
  console.log('VITE_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log(`URL: ${supabaseUrl}`)
console.log(`Key: ${supabaseAnonKey.substring(0, 20)}...\n`)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  try {
    console.log('🔗 Testing connection...')
    
    // Test 1: Check if we can connect
    const { data: testData, error: testError } = await supabase
      .from('services')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Connection failed:', testError.message)
      console.log('\n📋 Possible issues:')
      console.log('1. Database schema not set up yet')
      console.log('2. Tables do not exist')
      console.log('3. API key is incorrect')
      console.log('4. Project URL is wrong')
      return
    }
    
    console.log('✅ Database connection successful!\n')
    
    // Test 2: Check services table
    console.log('📊 Checking services table...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
    
    if (servicesError) {
      console.log('❌ Services table error:', servicesError.message)
      return
    }
    
    console.log(`✅ Found ${services.length} services in database`)
    
    if (services.length > 0) {
      console.log('\n📋 Sample services:')
      services.slice(0, 3).forEach(service => {
        console.log(`  - ${service.icon} ${service.name}: $${service.national_average}`)
      })
    } else {
      console.log('⚠️  No services found - you may need to run the SQL schema')
    }
    
    // Test 3: Check price_submissions table
    console.log('\n📊 Checking price_submissions table...')
    const { data: submissions, error: submissionsError } = await supabase
      .from('price_submissions')
      .select('*')
    
    if (submissionsError) {
      console.log('❌ Price submissions table error:', submissionsError.message)
      return
    }
    
    console.log(`✅ Found ${submissions.length} price submissions`)
    
    if (submissions.length > 0) {
      console.log('\n📋 Sample submissions:')
      submissions.slice(0, 3).forEach(sub => {
        console.log(`  - $${sub.price} for service ID: ${sub.service_id}`)
      })
    } else {
      console.log('ℹ️  No price submissions yet - this is normal for a new database')
    }
    
    // Test 4: Try to insert a test record
    console.log('\n🧪 Testing write access...')
    const { data: insertData, error: insertError } = await supabase
      .from('price_submissions')
      .insert({
        service_id: services[0]?.id || '00000000-0000-0000-0000-000000000000',
        price: 99.99,
        location_city: 'Test City',
        location_state: 'TS',
        description: 'Test submission from database test script',
        service_date: new Date().toISOString().split('T')[0]
      })
      .select()
    
    if (insertError) {
      console.log('❌ Write test failed:', insertError.message)
    } else {
      console.log('✅ Write access working!')
      
      // Clean up test data
      if (insertData && insertData[0]) {
        await supabase
          .from('price_submissions')
          .delete()
          .eq('id', insertData[0].id)
        console.log('🧹 Test data cleaned up')
      }
    }
    
    console.log('\n🎉 Database test completed successfully!')
    console.log('Your How Much app is ready to use with real data.')
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

testDatabase() 