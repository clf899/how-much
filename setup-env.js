#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Setting up environment variables for How Much...\n');

console.log('📋 Steps to find your anon key:');
console.log('1. Go to https://supabase.com');
console.log('2. Sign in to your account');
console.log('3. Click on your project (kzpabadazveadirpqabd)');
console.log('4. Go to Settings → API');
console.log('5. Copy the "anon public" key (starts with eyJ...)\n');

rl.question('Enter your Supabase anon key: ', (anonKey) => {
  // Create .env.local file
  const envContent = `VITE_SUPABASE_URL=https://kzpabadazveadirpqabd.supabase.co
VITE_SUPABASE_ANON_KEY=${anonKey}`;

  fs.writeFileSync('.env.local', envContent);
  
  console.log('\n✅ Created .env.local file with your credentials');
  console.log('\n📋 Next Steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Test the database connection');
  console.log('3. Set up the database schema (see SUPABASE_SETUP.md)');
  
  rl.close();
}); 