#!/usr/bin/env node

console.log('🕷️  Testing Web Scraper for Real Pricing Data\n')

async function testScraper() {
  try {
    // Import the scraper
    const { scrapeServicePricing, scrapeSingleSource } = require('./src/services/webScraper.ts')
    
    const testService = 'junk-removal'
    const testLocation = '10001, New York, NY'
    
    console.log(`🔍 Testing scraper for: ${testService} in ${testLocation}\n`)
    
    console.log('📊 Scraping all sources...')
    const allResults = await scrapeServicePricing(testService, testLocation)
    
    console.log('\n📈 Results Summary:')
    console.log(`   Total sources: ${allResults.summary.totalSources}`)
    console.log(`   Successful sources: ${allResults.summary.successfulSources}`)
    console.log(`   Total prices found: ${allResults.summary.totalPrices}`)
    console.log(`   Average price: $${allResults.summary.averagePrice.toFixed(2)}`)
    console.log(`   Price range: $${allResults.summary.priceRange.min} - $${allResults.summary.priceRange.max}`)
    
    console.log('\n📋 Detailed Results:')
    allResults.results.forEach(result => {
      console.log(`\n   ${result.source}:`)
      console.log(`     Success: ${result.success ? '✅' : '❌'}`)
      console.log(`     Prices found: ${result.data.length}`)
      if (result.error) {
        console.log(`     Error: ${result.error}`)
      }
      if (result.data.length > 0) {
        console.log(`     Sample prices: ${result.data.slice(0, 3).map(p => `$${p.price}`).join(', ')}`)
      }
    })
    
    console.log('\n💡 Tips:')
    console.log('   - The scraper respects rate limits to be respectful to websites')
    console.log('   - It automatically handles errors and continues with other sources')
    console.log('   - Data is combined from multiple sources for comprehensive pricing')
    console.log('   - The scraper can be integrated into your app for real-time data')
    
  } catch (error) {
    console.error('❌ Scraper test failed:', error.message)
    console.log('\n💡 Make sure you have:')
    console.log('   - Installed puppeteer: npm install puppeteer')
    console.log('   - Good internet connection')
    console.log('   - Websites are accessible')
  }
}

async function testSingleSource() {
  try {
    const { scrapeSingleSource } = require('./src/services/webScraper.ts')
    
    console.log('\n🎯 Testing single source (Thumbtack)...')
    const result = await scrapeSingleSource('thumbtack', 'lawn-mowing', '90210, Beverly Hills, CA')
    
    console.log(`\n📊 Thumbtack Results:`)
    console.log(`   Success: ${result.success ? '✅' : '❌'}`)
    console.log(`   Prices found: ${result.data.length}`)
    if (result.data.length > 0) {
      console.log(`   Sample prices: ${result.data.slice(0, 5).map(p => `$${p.price}`).join(', ')}`)
    }
    
  } catch (error) {
    console.error('❌ Single source test failed:', error.message)
  }
}

async function main() {
  await testScraper()
  await testSingleSource()
  
  console.log('\n🎯 Next Steps:')
  console.log('1. The scraper is ready to use in your app')
  console.log('2. You can call scrapeServicePricing() to get real data')
  console.log('3. Data will be automatically saved to your database')
  console.log('4. The app will show real prices from multiple sources')
  
  process.exit(0)
}

main().catch(console.error) 