/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { fetchProfile } from "@/lib/solana/profile";
import { fetchFromIPFS } from "@/lib/ipfs";
import { PROGRAM_ID } from "@/lib/solana/constants";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";

// Define proper TypeScript interfaces
interface ProfileData {
  skills: string[];
  hackathon_participations: number;
  verified: boolean;
  ipfs_cid?: string;
}

interface IPFSData {
  name?: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export default function ProfilePage() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [ipfsData, setIPFSData] = useState<IPFSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ipfsLoading, setIPFSLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!publicKey) return;

      try {
        setLoading(true);
        setError(null);

        // Add explicit error handling for PDA derivation
        const [profilePubkey, error] = await PublicKey.findProgramAddress(
          [
            Buffer.from("profile"),
            publicKey.toBuffer(), // Ensure wallet pubkey matches creation
            Buffer.from([1]), // Add bump seed if used in creation
          ],
          new PublicKey(PROGRAM_ID)
        ).catch((err) => [null, err]);

        if (error || !profilePubkey) {
          console.error("PDA derivation failed:", {
            error,
            publicKey: publicKey?.toString(),
            programId: PROGRAM_ID,
          });
          return;
        }

        console.log("Looking for profile at:", profilePubkey.toString());

        // 2. Fetch on-chain profile data
        const profileAccount = await fetchProfile(connection, profilePubkey);

        if (!profileAccount) {
          setError("Profile not found on-chain");
          setLoading(false);
          return;
        }

        setProfileData(profileAccount);
        console.log("Found profile:", profileAccount);

        // 3. Use IPFS CID to fetch extended profile data from Pinata
        if (profileAccount.ipfs_cid) {
          try {
            setIPFSLoading(true);
            console.log("Fetching from IPFS CID:", profileAccount.ipfs_cid);
            const data = await fetchFromIPFS(profileAccount.ipfs_cid);
            setIPFSData(data);
            console.log("IPFS data from Pinata:", data);
          } catch (ipfsErr) {
            console.error("Failed to load IPFS data:", ipfsErr);
            // Don't set main error, just log the IPFS error
          } finally {
            setIPFSLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [publicKey, connection]);

  

  // If no wallet is connected
  if (!publicKey) {
    return (
      <div>
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">View Your Profile</h1>
          <p className="mb-4">Connect your wallet to view your profile</p>
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Loading Profile...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <p>You may need to create a profile first.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  // Successful profile load
  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Your BuddyFi Profile</h1>

        {/* Avatar from IPFS */}
        {ipfsLoading ? (
          <div className="mb-6 text-center">
            <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 animate-pulse"></div>
          </div>
        ) : ipfsData?.avatar ? (
          <div className="mb-6 text-center">
            <img
              src={ipfsData.avatar}
              alt={`${ipfsData?.name || "User"}'s profile picture`}
              className="w-24 h-24 rounded-full mx-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/default-avatar.png"; // Fallback image
                target.onerror = null;
              }}
            />
          </div>
        ) : null}

        <div className="space-y-4">
          {/* User Info from IPFS */}
          {ipfsData?.name && (
            <div>
              <h2 className="text-lg font-semibold">Name</h2>
              <p>{ipfsData.name}</p>
            </div>
          )}

          {ipfsData?.bio && (
            <div>
              <h2 className="text-lg font-semibold">Bio</h2>
              <p>{ipfsData.bio}</p>
            </div>
          )}

          {/* Skills from on-chain data */}
          <div>
            <h2 className="text-lg font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {profileData?.skills && profileData.skills.length > 0 ? (
                profileData.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills added</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Hackathon Participations</h2>
            <p>{profileData?.hackathon_participations || 0}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Verification Status</h2>
            <p>
              {profileData?.verified ? (
                <span className="text-green-600">Verified ✓</span>
              ) : (
                <span className="text-gray-500">Not verified</span>
              )}
            </p>
          </div>

          {/* Social links from IPFS */}
          {ipfsData?.social &&
            Object.values(ipfsData.social).some((link) => !!link) && (
              <div>
                <h2 className="text-lg font-semibold">Social Links</h2>
                <div className="space-y-2">
                  {ipfsData.social.twitter && (
                    <p>
                      Twitter:
                      <a
                        href={`https://twitter.com/${ipfsData.social.twitter.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {ipfsData.social.twitter}
                      </a>
                    </p>
                  )}
                  {ipfsData.social.github && (
                    <p>
                      GitHub:
                      <a
                        href={`https://github.com/${ipfsData.social.github.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {ipfsData.social.github}
                      </a>
                    </p>
                  )}
                  {ipfsData.social.linkedin && (
                    <p>
                      LinkedIn:
                      <a
                        href={
                          ipfsData.social.linkedin.startsWith("http")
                            ? ipfsData.social.linkedin
                            : `https://linkedin.com/in/${ipfsData.social.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {ipfsData.social.linkedin}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

          <div>
            <h2 className="text-lg font-semibold">Wallet Address</h2>
            <p className="text-sm font-mono break-all">
              {publicKey.toString()}
            </p>
          </div>

          {/* IPFS CID Info */}
          {profileData?.ipfs_cid && (
            <div>
              <h2 className="text-lg font-semibold">IPFS CID</h2>
              <p className="text-sm font-mono break-all">
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${profileData.ipfs_cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profileData.ipfs_cid}
                </a>
              </p>
            </div>
          )}

          {/* Edit Profile Button */}
          <div className="mt-6">
            <Link
              href="/editprofile"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
