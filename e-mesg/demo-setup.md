# E-mesg Demo Setup Guide

This guide will help you quickly set up E-mesg for demonstration purposes.

## Quick Start (5 minutes)

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "e-mesg-demo" (or your preferred name)
4. Enable Google Analytics (optional)

### 2. Enable Firebase Services

#### Authentication
1. Go to Authentication → Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** provider
   - Add your domain (e.g., `localhost` for local development)
   - Download the configuration

#### Firestore Database  
1. Go to Firestore Database → Create database
2. Start in **test mode** (rules will be set later)
3. Choose your location (closest to your users)

#### Storage
1. Go to Storage → Get started
2. Start in **test mode**

### 3. Get Firebase Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web app (</>) 
4. Name your app "E-mesg"
5. Copy the Firebase configuration object

### 4. Update Your App

Replace the config in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 5. Install and Run

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Visit `http://localhost:5173` and you're ready to demo!

## Demo Flow

### For Investors/Stakeholders

1. **Sign Up Demo**: Create 2 accounts using different email addresses
2. **Profile Setup**: Show profile customization 
3. **Status Feature**: Post a status update with text/image
4. **Real-time Chat**: 
   - Search for the other user by name
   - Start a conversation
   - Send messages in real-time
   - Show read receipts
5. **Responsive Design**: Resize window to show mobile responsiveness

### Test Accounts (Recommended)

Create these for quick demos:
- `alice.demo@example.com` / `password123` (Alice Johnson)
- `bob.demo@example.com` / `password123` (Bob Smith) 

## Demo Script (2 minutes)

> "E-mesg is a modern, real-time messaging platform that brings smart conversations to life."

1. **Authentication** (15 seconds)
   - "Secure sign-up with email/password or Google OAuth"
   - Show sign-up process

2. **Profile Management** (15 seconds) 
   - "Users can customize their profiles with photos and bio"
   - Navigate to Profile tab, show editing

3. **Status Updates** (30 seconds)
   - "WhatsApp-style status stories with 24-hour expiration"
   - Add a text status
   - Show it appears for other users

4. **Real-time Messaging** (60 seconds)
   - "Lightning-fast real-time messaging with Firebase"
   - Search for another user
   - Start a conversation  
   - Send messages, show instant delivery
   - Highlight read receipts (✓ sent, ✓✓ read)
   - Show message timestamps

> "Built with React, TypeScript, and Firebase - production-ready and scalable."

## Production Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
bun run build
firebase deploy
```

### Manual Deployment Steps

1. **Set Security Rules**: Deploy the included `firestore.rules` and `storage.rules`
2. **Update Firebase Config**: Replace demo config with production values  
3. **Domain Setup**: Configure authorized domains in Firebase Auth
4. **SSL Certificate**: Enable HTTPS (automatically handled by Firebase Hosting)

## Security Considerations

⚠️ **Important**: The demo uses test mode rules. For production:

1. Deploy the security rules from this project
2. Review and customize rules for your use case
3. Enable App Check for additional security
4. Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **"Permission denied"**: Check Firestore rules are deployed
2. **Auth not working**: Verify domain is added to authorized domains
3. **Messages not syncing**: Check Firestore indexes are created
4. **Images not uploading**: Verify Storage rules and bucket exists

### Useful Firebase Commands

```bash
# Deploy only rules
firebase deploy --only firestore:rules,storage

# Check project status  
firebase projects:list

# View usage
firebase functions:log
```

## Next Steps

After the demo, consider these enhancements:

1. **Push Notifications** - Firebase Cloud Messaging
2. **Offline Support** - PWA with service workers  
3. **Voice Messages** - Web Audio API integration
4. **Video Calling** - WebRTC implementation
5. **Group Admin Features** - Role-based permissions
6. **Message Encryption** - End-to-end encryption
7. **Dark Mode** - Theme switching
8. **Desktop App** - Electron wrapper

## Support

- **Documentation**: See README.md for full setup guide
- **Issues**: Check GitHub issues for common problems
- **Firebase Console**: Monitor usage and debug in real-time

---

Ready to impress? Your modern messaging app demo is set up in under 5 minutes! 🚀