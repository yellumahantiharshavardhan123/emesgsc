# 🔥 Firebase Setup Guide

Follow these steps to set up Firebase for your E-mesg app:

## Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `e-mesg-demo` (or your preferred name)
4. **Disable Google Analytics** (optional, you can enable later)
5. **Click "Create project"**

## Step 2: Enable Authentication

1. **In your Firebase project, click "Authentication"**
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable these providers:**
   - **Email/Password**: Click → Enable → Save
   - **Google**: Click → Enable → Add your email → Save

## Step 3: Create Firestore Database

1. **Click "Firestore Database" in sidebar**
2. **Click "Create database"**
3. **Select "Start in test mode"** (we'll set proper rules later)
4. **Choose location** closest to your users
5. **Click "Done"**

## Step 4: Enable Storage

1. **Click "Storage" in sidebar**
2. **Click "Get started"**
3. **Select "Start in test mode"**
4. **Use same location as Firestore**
5. **Click "Done"**

## Step 5: Get Your Firebase Configuration

1. **Go to Project Settings** (gear icon in sidebar)
2. **Scroll to "Your apps" section**
3. **Click the web icon `</>`**
4. **Enter app nickname**: `E-mesg`
5. **Check "Also set up Firebase Hosting"**
6. **Click "Register app"**
7. **Copy the firebaseConfig object** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id", 
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Step 6: Update Your App

**COPY YOUR CONFIG** from above and I'll update your app with the real Firebase credentials.

Just paste your `firebaseConfig` object here and I'll configure everything for you!

---

## Troubleshooting

❌ **"API key not valid"** = Need to update config with real values  
❌ **"Project not found"** = Wrong project ID  
❌ **"Auth domain not authorized"** = Need to add domain in Authentication settings

---

**Once you have your config, just paste it here and I'll set everything up!** 🚀