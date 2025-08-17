import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Users, MessageCircle } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface NewChatDialogProps {
  onChatCreated?: (chatId: string) => void;
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({ onChatCreated }) => {
  const { currentUser, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen && searchTerm.trim()) {
      searchUsers();
    } else if (!searchTerm.trim()) {
      setUsers([]);
    }
  }, [searchTerm, isOpen]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff')
      );
      
      const snapshot = await getDocs(usersQuery);
      const foundUsers: UserProfile[] = [];
      
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (doc.id !== currentUser?.uid) {
          foundUsers.push({
            uid: doc.id,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          });
        }
      });
      
      setUsers(foundUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDirectChat = async (targetUser: UserProfile) => {
    if (!currentUser || !userProfile) return;
    
    setCreating(true);
    try {
      const chatData = {
        participants: [currentUser.uid, targetUser.uid],
        participantDetails: {
          [currentUser.uid]: {
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL || ''
          },
          [targetUser.uid]: {
            displayName: targetUser.displayName,
            photoURL: targetUser.photoURL || ''
          }
        },
        lastMessage: {
          text: '',
          senderId: '',
          timestamp: Timestamp.now(),
          type: 'text' as const
        },
        unreadCount: 0,
        isGroup: false,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);
      
      onChatCreated?.(docRef.id);
      setIsOpen(false);
      setSearchTerm('');
      setUsers([]);
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setCreating(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Start New Chat</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" disabled>
              <Users className="mr-3 h-4 w-4" />
              New Group Chat
              <span className="ml-auto text-xs text-gray-400">Coming Soon</span>
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            )}
            
            {!loading && searchTerm && users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No users found</p>
                <p className="text-xs">Try searching with a different name</p>
              </div>
            )}
            
            {users.map((user) => (
              <div
                key={user.uid}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => createDirectChat(user)}
                  disabled={creating}
                >
                  {creating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          {!searchTerm && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Search for users to start chatting</p>
              <p className="text-xs">Enter a name in the search box above</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};