import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle } from 'lucide-react';
import { NewChatDialog } from './NewChatDialog';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: string;
  participants: string[];
  participantDetails: { [key: string]: { displayName: string; photoURL?: string } };
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
    type: 'text' | 'image' | 'file';
  };
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupPhoto?: string;
}

interface ChatListProps {
  onChatSelect?: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessage.timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatList: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatList.push({
          id: doc.id,
          ...data
        } as Chat);
      });
      setChats(chatList);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const filteredChats = chats.filter((chat) => {
    const searchLower = searchTerm.toLowerCase();
    if (chat.isGroup) {
      return chat.groupName?.toLowerCase().includes(searchLower);
    } else {
      const otherParticipant = chat.participants.find(id => id !== currentUser?.uid);
      const otherUser = otherParticipant ? chat.participantDetails[otherParticipant] : null;
      return otherUser?.displayName?.toLowerCase().includes(searchLower);
    }
  });

  const getDisplayName = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupName || 'Group Chat';
    }
    const otherParticipant = chat.participants.find(id => id !== currentUser?.uid);
    return otherParticipant ? chat.participantDetails[otherParticipant]?.displayName || 'Unknown User' : 'Unknown User';
  };

  const getDisplayPhoto = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupPhoto;
    }
    const otherParticipant = chat.participants.find(id => id !== currentUser?.uid);
    return otherParticipant ? chat.participantDetails[otherParticipant]?.photoURL : undefined;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <NewChatDialog onChatCreated={onChatSelect ? (chatId) => {
          // For now, we'll need to refetch or handle this differently
          // In a full implementation, you'd want to trigger a refresh
          console.log('New chat created:', chatId);
        } : undefined} />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start a new conversation to see your chats here
            </p>
            <Button variant="outline" size="sm">
              Start Chatting
            </Button>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect?.(chat)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getDisplayPhoto(chat)} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(getDisplayName(chat))}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {getDisplayName(chat)}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {chat.lastMessage && formatDistanceToNow(chat.lastMessage.timestamp.toDate(), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage?.type === 'image' ? '📷 Image' : 
                       chat.lastMessage?.type === 'file' ? '📁 File' :
                       chat.lastMessage?.text || 'No messages yet'}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge variant="default" className="bg-blue-600 text-white text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};