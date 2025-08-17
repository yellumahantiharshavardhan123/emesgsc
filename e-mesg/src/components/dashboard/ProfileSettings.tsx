import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Camera, Save, Edit3 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '@/lib/firebase';

export const ProfileSettings: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      await updateUserProfile({
        displayName,
        bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${currentUser.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update profile with new photo URL
      await updateProfile(currentUser, { photoURL: downloadURL });
      await updateUserProfile({ photoURL: downloadURL });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const cancelEdit = () => {
    setDisplayName(userProfile?.displayName || '');
    setBio(userProfile?.bio || '');
    setIsEditing(false);
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="p-4">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-h-full overflow-y-auto">
      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Photo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={userProfile.photoURL} />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {getInitials(userProfile.displayName)}
              </AvatarFallback>
            </Avatar>
            
            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          
          {uploading && (
            <p className="text-sm text-gray-600">Uploading photo...</p>
          )}
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </Label>
            {isEditing ? (
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                {userProfile.displayName || 'No display name set'}
              </p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Label>
            <p className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-600">
              {userProfile.email}
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                maxLength={150}
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[80px]">
                {userProfile.bio || 'No bio added yet'}
              </p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-500">{bio.length}/150 characters</p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving || !displayName.trim()}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={cancelEdit} disabled={saving}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Member since:</span>
            <span>{userProfile.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Last active:</span>
            <span>{userProfile.lastActive.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>User ID:</span>
            <span className="font-mono text-xs">{currentUser.uid.slice(0, 8)}...</span>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>About E-mesg</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <p className="mb-2">Smart conversation starts here</p>
          <p>Version 1.0.0 - Built with React and Firebase</p>
        </CardContent>
      </Card>
    </div>
  );
};