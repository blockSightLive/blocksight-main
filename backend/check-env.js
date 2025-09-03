#!/usr/bin/env node

/**
 * Script to check and verify .env file contents
 * This will help us debug the environment variable loading issue
 */

const fs = require('fs');
const path = require('path');

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  console.log('Checking .env file...');
  console.log('Path:', envPath);
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file does not exist at:', envPath);
    return;
  }
  
  console.log('✅ .env file exists');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('\n.env file contents:');
    console.log('==================');
    
    const lines = envContent.split('\n');
    lines.forEach((line, index) => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        
        if (key && value) {
          if (key.includes('PASSWORD')) {
            console.log(`${index + 1}: ${key}=${value.length > 0 ? '***SET***' : 'NOT SET'} (length: ${value.length})`);
          } else {
            console.log(`${index + 1}: ${key}=${value}`);
          }
        }
      }
    });
    
    console.log('\n==================');
    
    // Check for Bitcoin Core specific variables
    const bitcoinCoreUrl = envContent.match(/BITCOIN_CORE_URL=(.+)/);
    const bitcoinCoreUsername = envContent.match(/BITCOIN_CORE_USERNAME=(.+)/);
    const bitcoinCorePassword = envContent.match(/BITCOIN_CORE_PASSWORD=(.+)/);
    
    console.log('\nBitcoin Core Configuration:');
    console.log('URL:', bitcoinCoreUrl ? bitcoinCoreUrl[1] : 'NOT FOUND');
    console.log('Username:', bitcoinCoreUsername ? bitcoinCoreUsername[1] : 'NOT FOUND');
    console.log('Password:', bitcoinCorePassword ? '***SET***' : 'NOT FOUND');
    console.log('Password Length:', bitcoinCorePassword ? bitcoinCorePassword[1].length : 0);
    
    if (bitcoinCorePassword && bitcoinCorePassword[1] !== '123') {
      console.log('\n⚠️  WARNING: Password is not "123"');
      console.log('Expected: 123 (3 characters)');
      console.log('Actual:', bitcoinCorePassword[1].length, 'characters');
      console.log('\nTo fix this, update your .env file:');
      console.log('BITCOIN_CORE_PASSWORD=123');
    }
    
  } catch (error) {
    console.log('❌ Error reading .env file:', error.message);
  }
}

checkEnvFile();
