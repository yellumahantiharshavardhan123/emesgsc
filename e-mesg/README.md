# E-mesg - Smart conversation starts here

A modern, real-time messaging app built with React, TypeScript, and Firebase. E-mesg provides a WhatsApp-like experience with real-time chat, status updates, and profile management.

![E-mesg Screenshot](./docs/screenshot.png)

## Features

### ✅ Authentication
- Email/password login and signup
- Google Sign-in integration
- Secure user session management

### ✅ Real-Time Messaging
- One-to-one personal chat
- Group chat support
- Real-time message delivery using Firebase Firestore
- Read receipts (single/double tick indicators)
- Typing indicators
- Message timestamps and date grouping

### ✅ Status/Stories
- Text and image status updates
- 24-hour auto-deletion
- View counts and viewer tracking
- WhatsApp-like status interface

### ✅ Profile Management
- Update display name and bio
- Profile photo upload
- Account information display

### ✅ Modern UI/UX
- Clean, responsive design inspired by WhatsApp/Telegram
- Mobile-first approach
- Real-time updates
- Smooth animations and transitions

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS V4 + ShadCN UI Components
- **Backend/Database**: Firebase (Firestore, Authentication, Storage)
- **Deployment**: Firebase Hosting
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
e-mesg/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── chat/          # Chat interface components
│   │   ├── dashboard/     # Dashboard and main UI
│   │   └── ui/            # ShadCN UI components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/               # Utilities and configuration
│   │   ├── firebase.ts    # Firebase configuration
│   │   └── utils.ts       # Helper functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── firebase.json          # Firebase configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file\n```\n\n## Getting Started\n\n### Prerequisites\n\n- Node.js 18+ or Bun\n- Firebase project\n- Git\n\n### Installation\n\n1. **Clone the repository**\n   ```bash\n   git clone <your-repo-url>\n   cd e-mesg\n   ```\n\n2. **Install dependencies**\n   ```bash\n   # Using bun (recommended)\n   bun install\n   \n   # Or using npm\n   npm install\n   ```\n\n3. **Set up Firebase**\n   \n   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)\n   \n   b. Enable the following services:\n      - **Authentication** (Email/Password + Google)\n      - **Firestore Database** (Start in test mode)\n      - **Storage** (Start in test mode)\n      - **Hosting** (optional for deployment)\n   \n   c. Get your Firebase configuration:\n      - Go to Project Settings → General → Your apps\n      - Click on the web app icon or \"Add app\" if none exists\n      - Copy the Firebase configuration object\n   \n   d. Update `src/lib/firebase.ts` with your configuration:\n   ```typescript\n   const firebaseConfig = {\n     apiKey: \"your-api-key\",\n     authDomain: \"your-project.firebaseapp.com\",\n     projectId: \"your-project-id\",\n     storageBucket: \"your-project.appspot.com\",\n     messagingSenderId: \"your-sender-id\",\n     appId: \"your-app-id\"\n   };\n   ```\n\n4. **Configure Firebase Security Rules**\n   \n   a. **Firestore Rules** (`firestore.rules`):\n   ```javascript\n   rules_version = '2';\n   service cloud.firestore {\n     match /databases/{database}/documents {\n       // Users can read/write their own profile\n       match /users/{userId} {\n         allow read, write: if request.auth != null && request.auth.uid == userId;\n       }\n       \n       // Users can read other users' profiles (for chat)\n       match /users/{userId} {\n         allow read: if request.auth != null;\n       }\n       \n       // Chat messages - participants can read/write\n       match /messages/{messageId} {\n         allow read, write: if request.auth != null;\n       }\n       \n       // Chat rooms - participants can read/write\n       match /chats/{chatId} {\n         allow read, write: if request.auth != null;\n       }\n       \n       // Status updates\n       match /statuses/{statusId} {\n         allow read: if request.auth != null;\n         allow write: if request.auth != null && request.auth.uid == resource.data.userId;\n       }\n     }\n   }\n   ```\n   \n   b. **Storage Rules** (`storage.rules`):\n   ```javascript\n   rules_version = '2';\n   service firebase.storage {\n     match /b/{bucket}/o {\n       match /{allPaths=**} {\n         allow read, write: if request.auth != null;\n       }\n     }\n   }\n   ```\n\n5. **Run the development server**\n   ```bash\n   # Using bun\n   bun dev\n   \n   # Or using npm\n   npm run dev\n   ```\n\n6. **Open your browser**\n   \n   Navigate to `http://localhost:5173` to see the application.\n\n## Firebase Deployment\n\n### Prerequisites\n- Firebase CLI installed: `npm install -g firebase-tools`\n- Authenticated with Firebase: `firebase login`\n\n### Deploy to Firebase Hosting\n\n1. **Initialize Firebase in your project**\n   ```bash\n   firebase init\n   ```\n   \n   Select:\n   - ✅ Hosting: Configure files for Firebase Hosting\n   - Choose your Firebase project\n   - Set public directory to `dist`\n   - Configure as SPA (single-page application): **Yes**\n   - Don't overwrite index.html\n\n2. **Build and deploy**\n   ```bash\n   # Build the project\n   bun run build\n   \n   # Deploy to Firebase\n   firebase deploy\n   ```\n\n3. **Access your deployed app**\n   \n   Your app will be available at `https://your-project-id.web.app`\n\n## Usage\n\n### Authentication\n1. **Sign Up**: Create a new account with email/password or Google\n2. **Sign In**: Login with existing credentials\n3. **Profile**: Set your display name and bio\n\n### Messaging\n1. **Start a chat**: Click \"New Chat\" to begin a conversation\n2. **Send messages**: Type and press Enter or click Send\n3. **View status**: Check read receipts (✓ sent, ✓✓ read)\n\n### Status Updates\n1. **Add status**: Go to Status tab and add text or image\n2. **View others**: See status updates from other users\n3. **Auto-delete**: Statuses automatically delete after 24 hours\n\n### Profile Management\n1. **Edit profile**: Go to Profile tab\n2. **Update photo**: Click camera icon to upload new profile picture\n3. **Update info**: Edit display name and bio\n\n## Development\n\n### Available Scripts\n\n```bash\n# Development server\nbun dev\n\n# Build for production\nbun run build\n\n# Preview production build\nbun run preview\n\n# Lint code\nbun run lint\n\n# Type check\nbun run tsc\n```\n\n### Project Architecture\n\n- **Context-based state management** for authentication\n- **Component composition** for reusable UI elements\n- **Real-time subscriptions** using Firebase onSnapshot\n- **Optimistic updates** for better user experience\n- **Responsive design** with mobile-first approach\n\n### Key Components\n\n- `AuthContext`: Manages user authentication state\n- `Dashboard`: Main application layout with tabs\n- `ChatList`: Displays user conversations\n- `ChatInterface`: Real-time messaging interface\n- `StatusList`: Stories/status management\n- `ProfileSettings`: User profile management\n\n## Firebase Collections Structure\n\n### Users Collection (`/users/{userId}`)\n```typescript\n{\n  uid: string;\n  email: string;\n  displayName: string;\n  photoURL?: string;\n  bio?: string;\n  createdAt: Timestamp;\n  lastActive: Timestamp;\n}\n```\n\n### Messages Collection (`/messages/{messageId}`)\n```typescript\n{\n  chatId: string;\n  senderId: string;\n  senderDetails: {\n    displayName: string;\n    photoURL?: string;\n  };\n  content: {\n    type: 'text' | 'image' | 'file';\n    text?: string;\n    mediaUrl?: string;\n  };\n  timestamp: Timestamp;\n  readBy: string[];\n  reactions: { [emoji: string]: string[] };\n}\n```\n\n### Chats Collection (`/chats/{chatId}`)\n```typescript\n{\n  participants: string[];\n  participantDetails: { [userId: string]: {\n    displayName: string;\n    photoURL?: string;\n  }};\n  lastMessage: {\n    text: string;\n    senderId: string;\n    timestamp: Timestamp;\n    type: 'text' | 'image' | 'file';\n  };\n  isGroup: boolean;\n  groupName?: string;\n  groupPhoto?: string;\n}\n```\n\n### Status Collection (`/statuses/{statusId}`)\n```typescript\n{\n  userId: string;\n  userDetails: {\n    displayName: string;\n    photoURL?: string;\n  };\n  content: {\n    type: 'text' | 'image' | 'video';\n    text?: string;\n    mediaUrl?: string;\n  };\n  timestamp: Timestamp;\n  expiresAt: Timestamp;\n  viewers: string[];\n}\n```\n\n## Contributing\n\n1. Fork the repository\n2. Create a feature branch: `git checkout -b feature-name`\n3. Commit your changes: `git commit -am 'Add some feature'`\n4. Push to the branch: `git push origin feature-name`\n5. Submit a pull request\n\n## Future Enhancements\n\n- [ ] Voice messages\n- [ ] File sharing\n- [ ] Message reactions\n- [ ] Push notifications\n- [ ] Dark mode theme\n- [ ] Message search\n- [ ] Group admin features\n- [ ] Message encryption\n- [ ] Video calling\n- [ ] Desktop application\n\n## License\n\nMIT License - see LICENSE file for details.\n\n## Support\n\nFor questions or issues, please open an issue on GitHub or contact the development team.\n\n---\n\n**E-mesg** - Smart conversation starts here 💬