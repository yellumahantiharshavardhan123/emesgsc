#!/usr/bin/env node

/**
 * Firebase Configuration Updater for E-mesg
 * 
 * This script helps you update your Firebase configuration.
 * Run: node update-firebase-config.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔥 Firebase Configuration Updater for E-mesg\n');

console.log('Please provide your Firebase configuration:');
console.log('(You can find this in Firebase Console → Project Settings → Your apps)\n');

console.log('Example:');
console.log(`const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};`);

console.log('\n📝 To update your configuration:');
console.log('1. Copy your firebaseConfig object from Firebase Console');
console.log('2. Replace the demo config in src/lib/firebase.ts');
console.log('3. Or paste it here and I\'ll help you update it!');

console.log('\n🚀 After updating:');
console.log('- Run: bun dev');  
console.log('- Your app will be ready to use!');

// If user wants to paste config directly, they can modify this section
const updateConfig = (newConfig) => {
  try {
    const firebaseFilePath = join(__dirname, 'src', 'lib', 'firebase.ts');
    let fileContent = readFileSync(firebaseFilePath, 'utf8');
    
    // Replace the demo config with real config
    const configStart = fileContent.indexOf('const firebaseConfig = {');
    const configEnd = fileContent.indexOf('};', configStart) + 2;
    
    const newConfigString = `const firebaseConfig = ${JSON.stringify(newConfig, null, 2)};`;
    
    fileContent = fileContent.substring(0, configStart) + newConfigString + fileContent.substring(configEnd);
    
    writeFileSync(firebaseFilePath, fileContent);
    console.log('✅ Firebase configuration updated successfully!');
    console.log('🚀 Run "bun dev" to start your app!');
  } catch (error) {
    console.error('❌ Error updating configuration:', error.message);
    console.log('\n📝 Please manually update src/lib/firebase.ts with your configuration.');
  }
};

export { updateConfig };