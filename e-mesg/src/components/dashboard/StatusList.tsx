import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Eye, Image as ImageIcon, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, Timestamp, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

interface Status {
  id: string;
  userId: string;
  userDetails: {
    displayName: string;
    photoURL?: string;
  };
  content: {
    type: 'text' | 'image' | 'video';
    text?: string;
    mediaUrl?: string;
  };
  timestamp: Timestamp;
  expiresAt: Timestamp;
  viewers: string[];
}

export const StatusList: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [myStatuses, setMyStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStatusText, setNewStatusText] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    // Query for all statuses excluding current user's
    const statusesQuery = query(
      collection(db, 'statuses'),
      where('userId', '!=', currentUser.uid),
      where('expiresAt', '>', new Date()),
      orderBy('userId'),
      orderBy('timestamp', 'desc')
    );

    // Query for current user's statuses
    const myStatusesQuery = query(
      collection(db, 'statuses'),
      where('userId', '==', currentUser.uid),
      where('expiresAt', '>', new Date()),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe1 = onSnapshot(statusesQuery, (snapshot) => {
      const statusList: Status[] = [];
      snapshot.forEach((doc) => {
        statusList.push({ id: doc.id, ...doc.data() } as Status);
      });
      setStatuses(statusList);
    });

    const unsubscribe2 = onSnapshot(myStatusesQuery, (snapshot) => {
      const myStatusList: Status[] = [];
      snapshot.forEach((doc) => {
        myStatusList.push({ id: doc.id, ...doc.data() } as Status);
      });
      setMyStatuses(myStatusList);
      setLoading(false);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [currentUser]);

  const addTextStatus = async () => {
    if (!newStatusText.trim() || !currentUser || !userProfile) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    try {
      await addDoc(collection(db, 'statuses'), {
        userId: currentUser.uid,
        userDetails: {
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL || ''
        },
        content: {
          type: 'text',
          text: newStatusText
        },
        timestamp: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt),
        viewers: []
      });
      setNewStatusText('');
    } catch (error) {
      console.error('Error adding status:', error);
    }
  };

  const addImageStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser || !userProfile) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `statuses/${currentUser.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add status to Firestore
      await addDoc(collection(db, 'statuses'), {
        userId: currentUser.uid,
        userDetails: {
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL || ''
        },
        content: {
          type: 'image',
          mediaUrl: downloadURL
        },
        timestamp: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt),
        viewers: []
      });
    } catch (error) {
      console.error('Error adding image status:', error);
    }
  };

  const deleteStatus = async (statusId: string) => {
    try {
      await deleteDoc(doc(db, 'statuses', statusId));
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  const markStatusViewed = async (status: Status) => {
    if (!currentUser || status.viewers.includes(currentUser.uid)) return;

    // In a real app, you'd update the viewers array
    // For demo purposes, we'll just log it
    console.log(`Viewed status ${status.id}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Group statuses by user
  const groupedStatuses = statuses.reduce((acc, status) => {
    if (!acc[status.userId]) {
      acc[status.userId] = [];
    }
    acc[status.userId].push(status);
    return acc;
  }, {} as { [key: string]: Status[] });

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
      {/* Add Status Section */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <h3 className="font-semibold text-gray-900">My Status</h3>
        
        {/* My Status Display */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile?.photoURL} />
              <AvatarFallback className="bg-blue-600 text-white">
                {getInitials(userProfile?.displayName || '')}
              </AvatarFallback>
            </Avatar>
            {myStatuses.length === 0 && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Plus className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{userProfile?.displayName}</p>
            <p className="text-xs text-gray-500">
              {myStatuses.length > 0 
                ? `${myStatuses.length} status${myStatuses.length > 1 ? 'es' : ''}`
                : 'Tap to add status'
              }
            </p>
          </div>
        </div>

        {/* My Statuses */}
        {myStatuses.length > 0 && (
          <div className="space-y-2">
            {myStatuses.map((status) => (
              <Card key={status.id} className="relative">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {status.content.type === 'text' ? (
                        <p className="text-sm">{status.content.text}</p>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm">Image</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(status.timestamp.toDate(), { addSuffix: true })}
                        </span>
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{status.viewers.length}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStatus(status.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Status Controls */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Share your thoughts..."
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTextStatus()}
            />
            <Button onClick={addTextStatus} disabled={!newStatusText.trim()} size="sm">
              Post
            </Button>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={addImageStatus}
              className="hidden"
            />
            <Button variant="outline" size="sm" className="w-full">
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          </label>
        </div>
      </div>

      {/* Other Users' Statuses */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Recent updates</h3>
        
        {Object.keys(groupedStatuses).length === 0 ? (
          <div className="text-center py-8">
            <Eye className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No status updates</h4>
            <p className="text-sm text-gray-500">
              Status updates from your contacts will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedStatuses).map(([userId, userStatuses]) => {
              const latestStatus = userStatuses[0];
              const hasUnviewed = userStatuses.some(s => !s.viewers.includes(currentUser?.uid || ''));
              
              return (
                <div
                  key={userId}
                  onClick={() => markStatusViewed(latestStatus)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className={`h-12 w-12 ${hasUnviewed ? 'ring-2 ring-blue-500' : ''}`}>
                      <AvatarImage src={latestStatus.userDetails.photoURL} />
                      <AvatarFallback className="bg-gray-600 text-white">
                        {getInitials(latestStatus.userDetails.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{latestStatus.userDetails.displayName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(latestStatus.timestamp.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                  {userStatuses.length > 1 && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {userStatuses.length}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};