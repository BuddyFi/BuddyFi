/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { UserCard, UserProfile } from "@/components/UserCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import { useWallet } from "@solana/wallet-adapter-react";

interface PinataUser {
  userData: {
    walletAddress: string;
    name?: string;
    avatar?: string;
    skills?: string[];
    timezone?: string;
    bio?: string;
    githubUsername?: string;
    availability?: string;
    isMatched?: boolean;
  };
  pinInfo: {
    date_pinned: string;
  };
}

const Page = () => {
  const { publicKey } = useWallet();
  const [likedByProfiles, setLikedByProfiles] = useState<UserProfile[]>([]);
  const [matchedProfiles, setMatchedProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/match');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        // Transform the fetched data into UserProfile format
        const transformedProfiles = data.users.map((user: PinataUser) => ({
          id: user.userData.walletAddress,
          name: user.userData.name || 'Anonymous',
          avatar: user.userData.avatar || '/avatar.avif',
          skills: user.userData.skills || [],
          timezone: user.userData.timezone || 'Not specified',
          bio: user.userData.bio || 'No bio provided',
          githubUsername: user.userData.githubUsername,
          availability: user.userData.availability || 'Not specified',
          isMatched: user.userData.isMatched || false
        }));

        // Split profiles into liked and matched
        const liked = transformedProfiles.filter((profile: UserProfile) => !profile.isMatched);
        const matched = transformedProfiles.filter((profile: UserProfile) => profile.isMatched);

        setLikedByProfiles(liked);
        setMatchedProfiles(matched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [publicKey]);

  const handleConnect = async (profile: UserProfile) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Connecting...');

      // Here you would typically make an API call to update the match status
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the UI state
      setLikedByProfiles(prev => prev.filter(p => p.id !== profile.id));
      setMatchedProfiles(prev => [...prev, { ...profile, isMatched: true }]);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`Connected with ${profile.name}!`, {
        description: 'You can now chat with them in the matches tab.',
        duration: 5000,
      });

      // Here you would typically make an API call to save the match
      // For example:
      // await fetch('/api/matches', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     matchedUserId: profile.id,
      //     currentUserId: publicKey?.toString(),
      //   }),
      // });

    } catch (error) {
      toast.error('Failed to connect with user', {
        description: 'Please try again later.',
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="backdrop-blur-xl bg-white/2 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profiles...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="backdrop-blur-xl bg-white/2 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">Error Loading Profiles</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      );
    }

    return (
      <Tabs defaultValue="likes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-500/10">
          <TabsTrigger
            value="likes"
            className="data-[state=active]:bg-purple-300/70 data-[state=active]:text-white"
          >
            Builder profiles ({likedByProfiles.length})
          </TabsTrigger>
          <TabsTrigger
            value="matches"
            className="data-[state=active]:bg-purple-300/70 data-[state=active]:text-white"
          >
            Matches ({matchedProfiles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="likes">
          <div className="mb-4">
            <h2 className="text-xl font-medium mb-2">
              People who liked your profile
            </h2>
            <p className="text-gray-400 text-sm">
              Connect with them if you&apos;re also interested
            </p>
          </div>

          {likedByProfiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedByProfiles.map((profile) => (
                <UserCard
                  key={profile.id}
                  user={profile}
                  onConnect={() => handleConnect(profile)}
                />
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">No likes yet</h3>
              <p className="text-gray-400">
                When someone likes your profile, they will appear here
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches">
          <div className="mb-4">
            <h2 className="text-xl font-medium mb-2">Your Matches</h2>
            <p className="text-gray-400 text-sm">
              Both of you liked each other - let&apos;s connect!
            </p>
          </div>

          {matchedProfiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedProfiles.map((profile) => (
                <UserCard
                  key={profile.id}
                  user={profile}
                  onConnect={() => handleConnect(profile)}
                />
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">
                No matches yet
              </h3>
              <p className="text-gray-400">
                Keep swiping to find your perfect hackathon teammate
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 pb-24 md:pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Your Connections</h1>
            </div>

            {!publicKey ? (
              <div className="backdrop-blur-xl bg-white/2 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold mb-4">
                  Connect Wallet to View
                </h2>
                <p className="text-gray-300 mb-6">
                  Connect your wallet to see likes and matches
                </p>
                <div className="flex justify-center">
                  <ConnectWalletButton />
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
