/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bannerImage?: string;
  skills: string[];
  timezone: string;
  bio: string;
  githubUsername?: string;
  availability?: string;
  isMatched?: boolean;
}

interface UserCardProps {
  user: UserProfile;
  variant?: 'swipe' | 'grid';
  onLike?: (id: string) => void;
  onSkip?: (id: string) => void;
  onConnect?: (id: string) => void;
}

export const UserCard = ({ 
  user, 
  variant = 'grid',
  onLike,
  onSkip,
  onConnect
}: UserCardProps) => {
  const router = useRouter();
  
  const truncateBio = (bio: string, maxLength: number = 100) => {
    return bio.length > maxLength ? `${bio.substring(0, maxLength)}...` : bio;
  };

  const handleAction = () => {
    if (user.isMatched) {
      // Navigate to messages page with this user selected
      router.push(`/messages`);
    } else if (onConnect) {
      onConnect(user.id);
    }
  };

  if (variant === 'swipe') {
    return (
      <div className="relative w-full max-w-sm mx-auto h-[500px] rounded-xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] animate-card-enter">
        {user.bannerImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-20" 
            style={{ backgroundImage: `url(${user.bannerImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-300/20 to-transparent z-0" />
        )}
        
        <div className="relative z-10 p-6 flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-buddyfi-purple mr-3">
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.timezone}</p>
                </div>
              </div>
              
              {user.availability && (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {user.availability}
                </Badge>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">{truncateBio(user.bio)}</p>
              
              {user.githubUsername && (
                <a 
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-400 hover:text-buddyfi-purple mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {user.githubUsername}
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="skill-tag bg-purple-300/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              variant="outline" 
              size="icon"
              className="h-14 w-14 rounded-full border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-red-500"
              onClick={() => onSkip && onSkip(user.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              <span className="sr-only">Skip</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              className="h-14 w-14 rounded-full border-green-500/50 text-green-500 hover:bg-green-500/20 hover:text-green-500"
              onClick={() => onLike && onLike(user.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <span className="sr-only">Like</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Grid/List variant
  return (
    <div className="rounded-lg overflow-hidden backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:ring-1 hover:ring-buddyfi-purple/50 transition duration-300">
      <div className="h-24 bg-gradient-to-r from-buddyfi-purple/30 to-buddyfi-blue/30 relative">
        {user.bannerImage && (
          <img 
            src={user.bannerImage} 
            alt="" 
            className="w-full h-full object-cover opacity-50"
          />
        )}
      </div>
      
      <div className="p-6 pt-0">
        <div className="flex justify-between -mt-8 mb-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-buddyfi-purple bg-buddyfi-background">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </div>
          
          {user.isMatched && (
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">
              Matched
            </Badge>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-1">{user.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{user.timezone}</p>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{truncateBio(user.bio, 60)}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {user.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="skill-tag text-xs bg-buddyfi-purple/20">
              {skill}
            </Badge>
          ))}
          {user.skills.length > 3 && (
            <Badge variant="secondary" className="skill-tag text-xs bg-buddyfi-purple/10">
              +{user.skills.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          className="w-full bg-purple-300/20 hover:bg-purple-300/60 text-white"
          onClick={handleAction}
        >
          {user.isMatched ? 'Message' : 'Connect'}
        </Button>
      </div>
    </div>
  );
};