import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ChatInterface } from '@/components/chat/ChatInterface';

// Main App Content Component
const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
    photo?: string;
    isGroup: boolean;
    participants: string[];
  } | null>(null);

  // Show authentication form if user is not logged in
  if (!currentUser) {
    return (
      <AuthForm 
        isLogin={isLogin} 
        onToggle={() => setIsLogin(!isLogin)} 
      />
    );
  }

  // Show chat interface if a chat is selected
  if (selectedChat) {
    return (
      <ChatInterface
        chatId={selectedChat.id}
        chatName={selectedChat.name}
        chatPhoto={selectedChat.photo}
        isGroup={selectedChat.isGroup}
        participants={selectedChat.participants}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  // Show main dashboard
  return <Dashboard onChatSelect={setSelectedChat} />;
};

// Root App Component
export default function App() {
  return (
    <AuthProvider>
      <div className="h-screen bg-gray-50">
        <AppContent />
      </div>
    </AuthProvider>
  );
}
