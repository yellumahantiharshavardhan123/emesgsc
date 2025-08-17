import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, User, LogOut } from 'lucide-react';
import { ChatList } from './ChatList';
import { StatusList } from './StatusList';
import { ProfileSettings } from './ProfileSettings';
import { FeatureShowcase } from '../demo/FeatureShowcase';

interface DashboardProps {
  onChatSelect?: (chat: {
    id: string;
    name: string;
    photo?: string;
    isGroup: boolean;
    participants: string[];
  }) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChatSelect }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chats');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">E-mesg</h1>
                <p className="text-xs text-gray-500">Smart conversation starts here</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="chats" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chats</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="chats" className="h-full m-0">
              <ChatList onChatSelect={(chat) => {
                onChatSelect?.({
                  id: chat.id,
                  name: chat.isGroup ? chat.groupName || 'Group Chat' : 
                    (() => {
                      const otherParticipant = chat.participants.find(id => id !== currentUser?.uid);
                      return otherParticipant ? chat.participantDetails[otherParticipant]?.displayName || 'Unknown User' : 'Unknown User';
                    })(),
                  photo: chat.isGroup ? chat.groupPhoto :
                    (() => {
                      const otherParticipant = chat.participants.find(id => id !== currentUser?.uid);
                      return otherParticipant ? chat.participantDetails[otherParticipant]?.photoURL : undefined;
                    })(),
                  isGroup: chat.isGroup,
                  participants: chat.participants
                });
              }} />
            </TabsContent>
            <TabsContent value="status" className="h-full m-0">
              <StatusList />
            </TabsContent>
            <TabsContent value="profile" className="h-full m-0">
              <ProfileSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        <FeatureShowcase />
      </div>
    </div>
  );
};