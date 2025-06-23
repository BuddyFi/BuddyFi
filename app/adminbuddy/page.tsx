/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import gsap from "gsap";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import BuddyfiLoading from "@/components/buddyfi-loading";

type IpfsData = {
  name: string;
  bio: string;
  skills: string[];
  avatar?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  walletAddress: string;
};

type UserData = {
  pinInfo: any;
  userData: IpfsData;
};

export default function AdminBuddyPage() {
  const { publicKey } = useWallet();
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) return;

    fetch(`/api/adminbuddy?walletAddress=${publicKey.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "You are not authorized to access this feature");
        }
        return res.json();
      })
      .then(({ users }) => {
        console.log("Fetched users:", users); // Debug log
        setUsers(users || []);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        setUsers([]);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [publicKey]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Connect your wallet to access admin features</p>
        <div className="flex justify-center">
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400 mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-16 pb-24 md:pb-16">
        <div className="container mx-auto px-4 py-8">
          <BuddyfiLoading isLoading={loading}>
            <div
              ref={cardRef}
              className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-6"
            >
              <h1 className="text-2xl font-bold mb-6">
                Admin Dashboard - User Management
              </h1>

              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Wallet</th>
                        <th className="px-4 py-3 text-left">Skills</th>
                        <th className="px-4 py-3 text-left">GitHub</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => handleUserClick(user)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {user.userData.avatar ? (
                                <img
                                  src={user.userData.avatar}
                                  alt={user.userData.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-buddyfi-blue/20 flex items-center justify-center">
                                  {user.userData.name.charAt(0)}
                                </div>
                              )}
                              <span>{user.userData.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-gray-400">
                            {user.userData.walletAddress ? (
                              <>
                                {user.userData.walletAddress.substring(0, 6)}...
                                {user.userData.walletAddress.substring(
                                  user.userData.walletAddress.length - 4
                                )}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(user.userData.skills) &&
                              user.userData.skills.length > 0 ? (
                                <>
                                  {user.userData.skills
                                    .slice(0, 3)
                                    .map((skill, i) => (
                                      <Badge
                                        key={i}
                                        className="bg-purple-300/20 text-white text-xs px-2"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {user.userData.skills.length > 3 && (
                                    <Badge className="bg-gray-500/20 text-white text-xs px-2">
                                      +{user.userData.skills.length - 3}
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">
                                  No skills listed
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {user.userData.social && user.userData.social.github
                              ? user.userData.social.github
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserClick(user);
                              }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </BuddyfiLoading>
        </div>

        {/* User Profile Dialog */}
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] border-none bg-buddyfi-background/90 max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="py-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-buddyfi-background">
                    <img
                      src={selectedUser.userData.avatar || "./avatar.avif"}
                      alt={selectedUser.userData.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {selectedUser.userData.name}
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                      {selectedUser.userData.walletAddress ||
                        "Wallet address not available"}
                    </p>

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Bio</h3>
                      <p className="text-gray-300 whitespace-pre-line">
                        {selectedUser.userData.bio}
                      </p>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedUser.userData.skills) &&
                        selectedUser.userData.skills.length > 0 ? (
                          selectedUser.userData.skills.map((skill, i) => (
                            <Badge
                              key={i}
                              className="skill-tag bg-purple-300/20 text-white"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">
                            No skills listed
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedUser.userData.social ? (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Social Links
                        </h3>
                        <div className="space-y-2">
                          {selectedUser.userData.social.github && (
                            <a
                              href={`https://github.com/${selectedUser.userData.social.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-gray-300 hover:text-purple-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                              {selectedUser.userData.social.github}
                            </a>
                          )}

                          {selectedUser.userData.social.twitter && (
                            <a
                              href={`https://twitter.com/${selectedUser.userData.social.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-gray-300 hover:text-purple-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                              {selectedUser.userData.social.twitter}
                            </a>
                          )}

                          {selectedUser.userData.social.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${selectedUser.userData.social.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-gray-300 hover:text-purple-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M0 0v24h24v-24h-24zm8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                              {selectedUser.userData.social.linkedin}
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Social Links
                        </h3>
                        <p className="text-gray-400">
                          No social links available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUserDetails(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
