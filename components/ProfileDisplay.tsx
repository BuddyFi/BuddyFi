/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ProfileData } from "@/services/profile/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";

export default function ProfileDisplay() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    setLoading(true);
    fetch(`/api/data?walletAddress=${walletAddress}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setProfile(null);
        } else {
          setProfile(data.profileData);
        }
      })
      .catch((err) => {
        setError("Something went wrong");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 mt-16 text-center border border-red-200 rounded-xl max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2 text-red-500">
          Profile Not Found
        </h2>
        <p className="mb-4">
          It looks like you haven&apos;t created your profile yet. To get
          started with BuddyFi, you&apos;ll need to set it up first.
        </p>
        <a
          href="/create"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Your Profile
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen pt-16 pb-24 md:pb-16">
        <div className="container mx-auto px-4 py-8">
          {!publicKey ? (
            <div className="max-w-lg mx-auto backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold mb-4">
                Connect Wallet to View Your Profile
              </h2>
              <p className="text-gray-300 mb-6">
                Connect your wallet to access and edit your profile
              </p>
              <ConnectWalletButton />
            </div>
          ) : (
            <>
              {/* Banner and Profile Info */}
              <div className="bg-gradient-to-r from-purple-300/20 to-buddyfi-blue/20 h-48 md:h-64 rounded-t-xl relative overflow-hidden">
                <img
                  src="./banner.jpg"
                  alt="Profile banner"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>

              <div className="relative z-10 backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl -mt-20 mx-4 md:mx-8 p-6">
                <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 md:-mt-24 mb-6">
                  <div className="h-32 w-32 rounded-xl overflow-hidden border-4 border-buddyfi-background">
                    <img
                      src="./avatar.avif"
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                        <p className="text-gray-400">{profile.walletAddress}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="border-purple-300/50 text-purple-300 hover:bg-purple-300/10"
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="mb-8">
                      <h2 className="text-xl font-bold mb-4">About</h2>
                      <p className="text-gray-300 whitespace-pre-line">
                        {profile.bio}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-xl font-bold mb-4">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string) => (
                          <Badge
                            key={skill}
                            className="skill-tag bg-purple-300/20 text-white"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-xl font-bold mb-4">Contact</h2>
                      <div className="space-y-3">
                        <a
                          href={`/dashboard?${profile.social.github}`}
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
                          {profile.social.github}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-6 mb-6">
                      <h3 className="font-medium mb-4">Availability</h3>
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">
                        weekends
                      </Badge>
                    </div>

                    <div className="backdrop-blur-xl bg-white/1 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-6">
                      <h3 className="font-medium mb-4">GitHub Activity</h3>
                      {profile.social.github ? (
                        <div>Activity</div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-400">
                            Add your GitHub username to see your activity
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
