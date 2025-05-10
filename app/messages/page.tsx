"use client";
import React, { useState, useEffect } from "react";
import { MessageChat } from "@/components/MessageChat";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Conversation {
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const Page = () => {
  const { publicKey } = useWallet();
  const currentUserId = publicKey?.toString() || "current-user";
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      userId: "3",
      name: "Miguel Santos",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastMessage:
        "I can work on the design system while you handle the smart contracts",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true,
    },
    {
      userId: "4",
      name: "Priya Patel",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastMessage: "Let's meet tomorrow to discuss the project architecture",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      unread: false,
    },
  ];

  // Check URL for userId parameter and set active conversation
  useEffect(() => {
    const userId = searchParams.get("userId");

    if (userId && conversations.some((conv) => conv.userId === userId)) {
      setActiveConversation(userId);
    }
  }, [searchParams]);

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { weekday: "short" });
    }
  };

  const activeUser = conversations.find(
    (convo) => convo.userId === activeConversation
  );
  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-16 pb-24 md:pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-gray-400">Chat with your hackathon matches</p>
            </div>

            {!publicKey ? (
              <div className="backdrop-blur-xl bg-white/2 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold mb-4">
                  Connect Wallet to Access Messages
                </h2>
                <p className="text-gray-300 mb-6">
                  Connect your wallet to see and send messages to your matches
                </p>
                <div className="flex justify-center">
                  <ConnectWalletButton />
                </div>
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-3 h-[600px]">
                  <div className="border-r border-gray-800">
                    <div className="p-4 border-b border-gray-800">
                      <h2 className="font-medium">Recent Messages</h2>
                    </div>

                    <div className="overflow-y-auto h-[calc(600px-65px)]">
                      {conversations.length > 0 ? (
                        <div>
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.userId}
                              className={`flex items-center p-4 hover:bg-purple-300/10 cursor-pointer transition-colors ${
                                activeConversation === conversation.userId
                                  ? "bg-purple-300/30"
                                  : ""
                              }`}
                              onClick={() =>
                                setActiveConversation(conversation.userId)
                              }
                            >
                              <div className="relative mr-3">
                                <Avatar>
                                  <AvatarImage
                                    src={conversation.avatar}
                                    alt={conversation.name}
                                  />
                                  <AvatarFallback>
                                    <UserRound className="h-5 w-5" />
                                  </AvatarFallback>
                                </Avatar>
                                {conversation.unread && (
                                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <h3 className="font-medium truncate">
                                    {conversation.name}
                                  </h3>
                                  <span className="text-xs text-gray-400">
                                    {formatRelativeTime(conversation.timestamp)}
                                  </span>
                                </div>
                                <p
                                  className={`text-sm truncate ${
                                    conversation.unread
                                      ? "text-white"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {conversation.lastMessage}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-gray-400">No messages yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    {activeUser ? (
                      <MessageChat
                        matchedUser={{
                          id: activeUser.userId,
                          name: activeUser.name,
                          avatar: activeUser.avatar,
                        }}
                        currentUserId={currentUserId}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="mx-auto h-12 w-12 rounded-full bg-buddyfi-purple/20 flex items-center justify-center mb-4">
                            <UserRound className="h-6 w-6 text-buddyfi-purple" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">
                            No conversation selected
                          </h3>
                          <p className="text-gray-400">
                            Select a conversation or match with more developers
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
