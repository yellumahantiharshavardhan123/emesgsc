#!/bin/bash

echo "🚀 Setting up Firebase rules for E-mesg..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase if not already logged in
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "Please login to Firebase..."
    firebase login
fi

# Initialize Firebase in the project
echo "⚙️  Initializing Firebase..."
firebase init firestore storage --project=emesg-mvp-sc

# Deploy rules
echo "📋 Deploying Firestore rules..."
firebase deploy --only firestore:rules --project=emesg-mvp-sc

echo "📁 Deploying Storage rules..."
firebase deploy --only storage --project=emesg-mvp-sc

echo "✅ Firebase rules deployed successfully!"
echo ""
echo "🎉 Your E-mesg app is now ready to use!"
echo "Run 'bun dev' to start the development server"