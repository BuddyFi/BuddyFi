/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProfileCreator.tsx
'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { initializeProfile } from '@/lib/solana/profile';
import ConnectWalletButton from '@/components/solana/ConnectWalletButton';
import ProfileForm from '@/components/ProfileForm';
import Link from 'next/link';
import { setCID } from '@/utils/cidStore';

export default function ProfileCreator() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [ipfsCid, setIpfsCid] = useState("");

  // Handle IPFS upload first
  const handleProfileSubmit = async (formData: any) => {
    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // 1. Upload profile data to IPFS
      const res = await fetch('/api/ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Add wallet address to IPFS data for reference
          walletAddress: publicKey.toString()
        }),
      });
      
      const { cid, error } = await res.json();
      
      if (error) {
        throw new Error(error);
      }
      
      // console.log("IPFS CID:", cid);
      setCID(cid)
      // console.log("IPFS stored:", cid);

      setIpfsCid(cid);
      
      // 2. Create on-chain profile with IPFS CID
      const txSignature = await initializeProfile(
        connection,
        publicKey,
        sendTransaction,
        cid, // Pass the CID to the initializeProfile function
        formData.skills || ["nextjs", "solana"] // Pass skills from form
      );
      
      setTxId(txSignature);
      // console.log(`Transaction successful! Signature: ${txSignature}`);
    } catch (err) {
      console.error("Profile creation error:", err);
      setError(err instanceof Error ? err.message : "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="mb-4">You need to connect your wallet to create a profile.</p>
        <ConnectWalletButton />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-600 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Your BuddyFi Profile</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {txId ? (
        <div className="text-green-600 p-4 bg-green-50 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Profile Created Successfully! 🎉</h2>
          <p className="mb-2">Your profile has been created on-chain and data stored on IPFS.</p>
          <div className="my-3">
            <div className="font-medium">Transaction:</div>
            <a
              href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {txId}
            </a>
          </div>
          {ipfsCid && (
            <div className="my-3">
              <div className="font-medium">IPFS CID:</div>
              <span className="font-mono text-sm break-all">{ipfsCid}</span>
            </div>
          )}
          <div className="mt-4">
            <Link 
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View Your Profile
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-6">Fill out your profile information below. This data will be stored on IPFS and linked to your Solana wallet address.</p>
          <ProfileForm onSubmit={handleProfileSubmit} isSubmitting={loading} />
        </>
      )}
    </div>
  );
}