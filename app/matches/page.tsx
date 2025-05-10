"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { UserCard, UserProfile } from "@/components/UserCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import { useWallet } from "@solana/wallet-adapter-react";

// Mock data for user profiles that liked me
const likedByProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["React", "TypeScript", "Solana"],
    timezone: "UTC-7 (PST)",
    bio: "Full-stack developer passionate about Web3. Looking for teammates for ETHGlobal hackathon!",
    githubUsername: "alexchen",
    availability: "Weekends",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Smart Contracts", "Solidity", "Rust"],
    timezone: "UTC+1 (CET)",
    bio: "Blockchain engineer specializing in Solidity and Rust. Previously worked at Aave and Chainlink.",
    githubUsername: "sarahj",
    availability: "Full-time",
  },
];

// Mock data for matches
const matchedProfiles: UserProfile[] = [
  {
    id: "3",
    name: "Miguel Santos",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["UX/UI", "Design Systems", "Figma"],
    timezone: "UTC-5 (EST)",
    bio: "Product designer with 5+ years of experience. Passionate about creating user-friendly interfaces for Web3 applications.",
    availability: "Evenings & Weekends",
    isMatched: true,
  },
  {
    id: "4",
    name: "Priya Patel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Backend", "Node.js", "AWS"],
    timezone: "UTC+5:30 (IST)",
    bio: "Backend engineer focused on scalable architectures. Looking to join a Web3 project as a backend developer.",
    githubUsername: "priyap",
    availability: "Full-time",
    isMatched: true,
  },
];

const Page = () => {
  const { publicKey } = useWallet();

  const handleConnect = (userId: string) => {
    toast.success(`Connected with user ${userId}!`);
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
              <Tabs defaultValue="likes" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-transparent">
                  <TabsTrigger
                    value="likes"
                    className="data-[state=active]:bg-purple-300/70 data-[state=active]:text-white"
                  >
                    Likes ({likedByProfiles.length})
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
                          onConnect={handleConnect}
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
                          onConnect={handleConnect}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
