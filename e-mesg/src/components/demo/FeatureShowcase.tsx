import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  Zap, 
  Shield, 
  Smartphone, 
  Clock,
  Check,
  CheckCheck,
  Image,
  Camera
} from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Lightning-fast message delivery with Firebase Firestore',
      items: ['Instant synchronization', 'Offline message queue', 'Message persistence']
    },
    {
      icon: Users,
      title: 'Smart Conversations',
      description: 'Enhanced chat experience with modern features',
      items: ['Read receipts (✓ ✓)', 'Typing indicators', 'Message timestamps']
    },
    {
      icon: Camera,
      title: 'Status Stories',
      description: 'Share moments that disappear in 24 hours',
      items: ['Text & image posts', 'Auto-deletion', 'View tracking']
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Built with security and privacy in mind',
      items: ['Firebase Authentication', 'Secure file storage', 'Access controls']
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Perfect experience on any device',
      items: ['Mobile-first design', 'Touch-friendly interface', 'Adaptive layouts']
    },
    {
      icon: Zap,
      title: 'Modern Stack',
      description: 'Built with cutting-edge technologies',
      items: ['React 19 + TypeScript', 'TailwindCSS V4', 'Firebase Backend']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">E-mesg</h1>
            <p className="text-gray-600">Smart conversation starts here</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live Demo
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                      <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Ready to Experience E-mesg?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This is a fully functional messaging app built with React, TypeScript, and Firebase. 
              Create an account, add some friends, and start chatting in real-time!
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCheck className="h-4 w-4 text-green-500" />
                <span>Production Ready</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-400 space-y-1">
        <p>Built with Scout - Version 1.0.0</p>
        <p>Powered by React 19, Firebase, and TailwindCSS</p>
      </div>
    </div>
  );
};