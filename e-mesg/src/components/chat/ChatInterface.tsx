import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  ArrowLeft,
  Check,
  CheckCheck
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  orderBy, 
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow, format } from 'date-fns';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderDetails: {
    displayName: string;
    photoURL?: string;
  };
  content: {
    type: 'text' | 'image' | 'file';
    text?: string;
    mediaUrl?: string;
    fileName?: string;
  };
  timestamp: Timestamp;
  readBy: string[];
  reactions: { [emoji: string]: string[] };
}

interface ChatInterfaceProps {
  chatId: string;
  chatName: string;
  chatPhoto?: string;
  isGroup: boolean;
  participants: string[];
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatId,
  chatName,
  chatPhoto,
  isGroup,
  participants,
  onBack
}) => {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: Message[] = [];
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messageList);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !userProfile) return;

    const messageData = {
      chatId,
      senderId: currentUser.uid,
      senderDetails: {
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL || ''
      },
      content: {
        type: 'text' as const,
        text: newMessage.trim()
      },
      timestamp: Timestamp.now(),
      readBy: [currentUser.uid],
      reactions: {}
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      
      // Update chat's last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: {
          text: newMessage.trim(),
          senderId: currentUser.uid,
          timestamp: Timestamp.now(),
          type: 'text'
        }
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isMessageRead = (message: Message) => {
    if (message.senderId === currentUser?.uid) {
      return message.readBy.length > 1; // Read by someone other than sender
    }
    return message.readBy.includes(currentUser?.uid || '');
  };

  const formatMessageTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return format(date, 'HH:mm');
    } else if (diffInDays === 1) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else if (diffInDays < 7) {
      return format(date, 'EEEE HH:mm');
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = message.timestamp.toDate();
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    
    return grouped;
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return format(date, 'EEEE');
    return format(date, 'dd MMMM yyyy');
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatPhoto} />
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(chatName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{chatName}</h2>
            <p className="text-xs text-gray-500">
              {isGroup ? `${participants.length} members` : 'Click here for contact info'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-sm text-gray-500">
                Start the conversation by sending a message below
              </p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([dateStr, dateMessages]) => (
            <div key={dateStr} className="space-y-4">
              {/* Date Header */}
              <div className="flex justify-center">
                <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                  {formatDateHeader(dateStr)}
                </div>
              </div>
              
              {/* Messages for this date */}
              {dateMessages.map((message) => {
                const isOwn = message.senderId === currentUser?.uid;
                const showAvatar = !isOwn && isGroup;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                      showAvatar ? 'items-end space-x-2' : ''
                    }`}
                  >
                    {showAvatar && (
                      <Avatar className="h-8 w-8 mb-1">
                        <AvatarImage src={message.senderDetails.photoURL} />
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {getInitials(message.senderDetails.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                    >
                      {showAvatar && (
                        <p className="text-xs text-gray-600 mb-1">
                          {message.senderDetails.displayName}
                        </p>
                      )}
                      
                      {message.content.type === 'text' && (
                        <p className="text-sm whitespace-pre-wrap">{message.content.text}</p>
                      )}
                      
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">
                          {formatMessageTime(message.timestamp)}
                        </span>
                        {isOwn && (
                          <div className="flex items-center">
                            {isMessageRead(message) ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};