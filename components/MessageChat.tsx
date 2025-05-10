
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, UserRound } from 'lucide-react';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
}

interface MessageChatProps {
  matchedUser: {
    id: string;
    name: string;
    avatar: string;
  };
  currentUserId: string;
}

export const MessageChat = ({ matchedUser, currentUserId }: MessageChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Load messages (mock implementation)
  useEffect(() => {
    // In a real app, you'd fetch messages from your database
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hi there! I saw your profile and thought we\'d make a great team for the ETHGlobal hackathon.',
        senderId: matchedUser.id,
        receiverId: currentUserId,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        content: 'Hey! Thanks for reaching out. I\'m definitely looking for teammates. What project ideas did you have in mind?',
        senderId: currentUserId,
        receiverId: matchedUser.id,
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000)
      },
      {
        id: '3',
        content: 'I was thinking of building a DeFi dashboard with real-time analytics. I can handle the smart contract integration if you want to work on the frontend.',
        senderId: matchedUser.id,
        receiverId: currentUserId,
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
      }
    ];
    
    setMessages(mockMessages);
  }, [matchedUser.id, currentUserId]);
  
  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, you'd save this to your database
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: currentUserId,
      receiverId: matchedUser.id,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    toast.success('Message sent');
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-gray-800">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={matchedUser.avatar} alt={matchedUser.name} />
          <AvatarFallback><UserRound className="h-6 w-6" /></AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{matchedUser.name}</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${isCurrentUser ? 'bg-buddyfi-purple rounded-tl-2xl rounded-tr-sm rounded-bl-2xl' : 'bg-gray-800 rounded-tr-2xl rounded-tl-sm rounded-br-2xl'} px-4 py-3`}>
                  <p className="text-sm">{message.content}</p>
                  <span className={`text-xs mt-1 block ${isCurrentUser ? 'text-buddyfi-purple-light' : 'text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e: { key: string; }) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-purple-300 hover:bg-dark-purple-300"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};