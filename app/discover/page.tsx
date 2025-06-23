/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState, useEffect, useRef } from "react";
import { UserCard, UserProfile } from "@/components/UserCard";
import { Button } from "@/components/ui/button";
// import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";
import BuddyfiLoading from "@/components/buddyfi-loading";

const mockProfiles: UserProfile[] = [
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
    bannerImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80",
    skills: ["Smart Contracts", "Solidity", "Rust"],
    timezone: "UTC+1 (CET)",
    bio: "Blockchain engineer specializing in Solidity and Rust. Previously worked at Aave and Chainlink.",
    githubUsername: "sarahj",
    availability: "Full-time",
  },
  {
    id: "3",
    name: "Miguel Santos",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["UX/UI", "Design Systems", "Figma"],
    timezone: "UTC-5 (EST)",
    bio: "Product designer with 5+ years of experience. Passionate about creating user-friendly interfaces for Web3 applications.",
    availability: "Evenings & Weekends",
  },
  {
    id: "4",
    name: "Priya Patel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1164&q=80",
    skills: ["Backend", "Node.js", "AWS"],
    timezone: "UTC+5:30 (IST)",
    bio: "Backend engineer focused on scalable architectures. Looking to join a Web3 project as a backend developer.",
    githubUsername: "priyap",
    availability: "Full-time",
  },
];

// Add these interfaces before the Page component
interface ApiUserData {
  pinInfo: {
    ipfs_pin_hash: string;
  };
  userData: {
    name: string;
    avatar?: string;
    bannerImage?: string;
    skills?: string[];
    timezone?: string;
    bio?: string;
    social?: {
      github?: string;
    };
    availability?: string;
  };
}

interface ApiResponse {
  users: ApiUserData[];
}

const Page = () => {
  const { publicKey } = useWallet();
   const walletAddress = publicKey?.toBase58();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<"left" | "right" | null>(null);
  const [showNotification, setShowNotification] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPosition = useRef({ x: 0, y: 0 });

  // Fetch user profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/user?walletAddress=${walletAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const data = await response.json() as ApiResponse;
        
        // Transform API data to match UserProfile interface
        const transformedProfiles: UserProfile[] = data.users.map((user) => ({
          id: user.pinInfo.ipfs_pin_hash,
          name: user.userData.name,
          avatar: user.userData.avatar || '/avatar.avif',
          bannerImage: user.userData.bannerImage,
          skills: user.userData.skills || [],
          timezone: user.userData.timezone || 'Not specified',
          bio: user.userData.bio || '',
          githubUsername: user.userData.social?.github,
          availability: user.userData.availability || 'Not specified'
        }));

        setProfiles(transformedProfiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Fallback to mock data in case of error
        setProfiles(mockProfiles);
      } finally {
        setIsLoading(false);
      }
    };

    if (publicKey) {
      fetchProfiles();
    }
  }, [publicKey]);

  const currentProfile = profiles[currentProfileIndex];
  const isFinished = currentProfileIndex >= profiles.length;

  // Function to handle like action
  const handleLike = () => {
    if (isAnimating || isFinished) return;

    setIsAnimating("right");

    if (showNotification) {
      toast.success(`You liked ${currentProfile.name}!`);
    }

    setTimeout(() => {
      setCurrentProfileIndex((prev) => prev + 1);
      setIsAnimating(null);
      setPosition({ x: 0, y: 0 });
    }, 500);
  };

  // Function to handle skip action
  const handleSkip = () => {
    if (isAnimating || isFinished) return;

    setIsAnimating("left");

    if (showNotification) {
      toast.info(`Skipped ${currentProfile.name}`);
    }

    setTimeout(() => {
      setCurrentProfileIndex((prev) => prev + 1);
      setIsAnimating(null);
      setPosition({ x: 0, y: 0 });
    }, 500);
  };

  // Touch and mouse handlers for card swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating || isFinished) return;
    startPosition.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating || isFinished) return;
    startPosition.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isAnimating || isFinished) return;
    const deltaX = e.touches[0].clientX - startPosition.current.x;
    const deltaY = e.touches[0].clientY - startPosition.current.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || isAnimating || isFinished) return;
    finishSwipe();
  };

  const handleMouseUp = () => {
    if (!isDragging || isAnimating || isFinished) return;
    finishSwipe();
  };

  const finishSwipe = () => {
    setIsDragging(false);

    // Determine if the swipe was significant enough to trigger an action
    if (position.x > 100) {
      handleLike();
    } else if (position.x < -100) {
      handleSkip();
    } else {
      // Reset position if swipe wasn't enough
      setPosition({ x: 0, y: 0 });
    }
  };

  // Add event listeners for mouse events outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startPosition.current.x;
        const deltaY = e.clientY - startPosition.current.y;
        setPosition({ x: deltaX, y: deltaY });
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging]);

  const resetProfiles = () => {
    setCurrentProfileIndex(0);
    setPosition({ x: 0, y: 0 });
    setIsAnimating(null);
  };

  const toggleNotifications = () => {
    setShowNotification((prev) => !prev);
    toast(
      showNotification ? "Notifications turned off" : "Notifications turned on"
    );
  };

  // Calculate rotation and opacity based on position
  const getCardStyle = () => {
    if (isAnimating) return {};

    const rotate = position.x * 0.1; // Rotate based on horizontal position

    return {
      transform: `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`,
      transition: isDragging ? "none" : "transform 0.3s ease",
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 pb-24 md:pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Discover Devs</h1>
              <p className="text-gray-400">
                Swipe to find your perfect hackathon teammate
              </p>
              {publicKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleNotifications}
                  className="mt-2 text-gray-400 hover:text-white"
                >
                  {showNotification ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Notifications On
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                      Notifications Off
                    </>
                  )}
                </Button>
              )}
            </div>

            <BuddyfiLoading isLoading={isLoading}>
              {!publicKey ? (
                <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
                  <h2 className="text-xl font-bold mb-4">
                    Connect Wallet to Start
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Connect your wallet to start discovering potential teammates
                  </p>
                  <div className="flex justify-center">
                    <ConnectWalletButton />
                  </div>
                </div>
              ) : error ? (
                <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-red-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h2 className="text-xl font-bold mb-2">Error Loading Profiles</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-purple-300 hover:bg-dark-purple-300"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : isFinished ? (
                <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-300/20 text-purple-300 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      You&apos;re all caught up!
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Check back later for new profiles or view your matches
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Button
                      onClick={resetProfiles}
                      className="bg-purple-300 hover:bg-dark-purple-300 cursor-pointer"
                    >
                      Refresh Profiles
                    </Button>
                    <Link href="/matches">
                      <Button
                        variant="outline"
                        className="border-purple-300/50 text-purple-300 cursor-pointer w-full"
                      >
                        View Matches
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  ref={cardRef}
                  className={`relative touch-none ${
                    isAnimating === "left"
                      ? "animate-card-slide-out-left"
                      : isAnimating === "right"
                      ? "animate-card-slide-out-right"
                      : "animate-card-enter"
                  }`}
                  style={getCardStyle()}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                >
                  <UserCard
                    user={currentProfile}
                    variant="swipe"
                    onLike={handleLike}
                    onSkip={handleSkip}
                  />

                  {/* Like indicator */}
                  <div
                    className={`absolute inset-0 bg-green-500/20 z-20 rounded-xl pointer-events-none transition-opacity duration-300 ${
                      isAnimating === "right" || position.x > 50
                        ? "opacity-" +
                          Math.min(Math.abs(position.x) / 200, 0.5).toFixed(2)
                        : "opacity-0"
                    }`}
                  >
                    <div className="flex h-full items-center justify-center">
                      <div className="bg-white/20 rounded-full p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Skip indicator */}
                  <div
                    className={`absolute inset-0 bg-red-500/20 z-20 rounded-xl pointer-events-none transition-opacity duration-300 ${
                      isAnimating === "left" || position.x < -50
                        ? "opacity-" +
                          Math.min(Math.abs(position.x) / 200, 0.5).toFixed(2)
                        : "opacity-0"
                    }`}
                  >
                    <div className="flex h-full items-center justify-center">
                      <div className="bg-white/20 rounded-full p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 6 6 18"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m6 6 12 12"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </BuddyfiLoading>

            <div className="mt-8 backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-6">
              <h3 className="font-medium mb-4">How It Works</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mr-2 text-purple-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    <strong className="text-white">Like</strong> a profile if
                    you&apos;re interested in teaming up
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mr-2 text-purple-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    <strong className="text-white">Skip</strong> if you
                    don&apos;t think they&apos;re a match
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mr-2 text-purple-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    <strong className="text-white">Match</strong> when both
                    users like each other
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
