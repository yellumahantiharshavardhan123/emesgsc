#!/bin/bash

echo "🚀 Deploying E-mesg to Firebase..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔑 Please login to Firebase..."
    firebase login
fi

# Build the project
echo "🏗️  Building project..."
bun run build

# Deploy Firestore rules and indexes
echo "🔐 Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy Storage rules  
echo "📁 Deploying Storage rules..."
firebase deploy --only storage

# Deploy to Firebase Hosting
echo "🌍 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo ""
echo "📱 Your app is now live!"
echo "🔗 Access it at your Firebase Hosting URL"
echo ""
echo "Next steps:"
echo "1. Visit Firebase Console to view analytics"
echo "2. Set up custom domain (optional)"
echo "3. Enable monitoring and alerts"
echo ""
echo "🎉 Happy messaging!"