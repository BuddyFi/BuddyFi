/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { createBundlr } from "@/utils/bundlr";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { initializeProfile } from "@/lib/solana/profile";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { setCID } from "@/utils/cidStore";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfileCreator() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [arweaveCid, setArweaveCid] = useState("");

  const handleProfileSubmit = async (formData: any) => {
    if (!publicKey || !wallet?.adapter) {
      setError("Wallet not connected or invalid adapter");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 👇 Upload to Arweave via Bundlr
      const bundlr = await createBundlr(wallet?.adapter);
      const profileData = {
        ...formData,
        walletAddress: publicKey.toString(),
        timestamp: Date.now(),
      };

      const tx = await bundlr.upload(JSON.stringify(profileData), {
        tags: [
          { name: "Content-Type", value: "application/json" },
           { name: "App", value: "BuddyFi" },
            { name: "Type", value: "UserProfile" },
          { name: "walletAddress", value: publicKey.toString() }, // Important for querying later
        ],
      });

      const arweaveUrl = `https://arweave.net/${tx.id}`;
      console.log("arweave url:", arweaveUrl);
      setCID(tx.id); // or arweaveUrl depending on how your smart contract stores it
      setArweaveCid(tx.id); // can rename to setArweaveId if needed

      const txSignature = await initializeProfile(
        connection,
        publicKey,
        sendTransaction,
        tx.id, // replace cid with Arweave tx id
        formData.skills || ["nextjs", "solana"]
      );

      setTxId(txSignature);
    } catch (err) {
      console.error("Profile creation error:", err);
      setError(err instanceof Error ? err.message : "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };
  if (!publicKey) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-lg shadow-lg text-white text-center">
        <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
        <p className="mb-6 text-gray-300">
          To create your BuddyFi profile, please connect your Solana wallet.
        </p>
        <ConnectWalletButton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-zinc-900 rounded-2xl shadow-xl text-white">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">
        🚀 Create Your BuddyFi Profile
      </h1>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-md">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {txId ? (
        <div className="p-6 bg-green-500/10 border border-green-500 rounded-md">
          <div className="flex items-center gap-2 text-green-400 text-lg font-semibold mb-3">
            <CheckCircle className="w-6 h-6" />
            Profile Created Successfully!
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Your profile is now live on-chain and stored on IPFS.
          </p>
          <div className="mb-3">
            <div className="font-semibold text-gray-200">Transaction:</div>
            <a
              href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline break-words"
            >
              {txId}
            </a>
          </div>
          <div className="mb-3">
            <div className="font-semibold text-gray-200">Arweave URL:</div>
            <a
              href={`https://arweave.net/${arweaveCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline break-words"
            >
              {arweaveCid}
            </a>
          </div>

          <Link
            href="/profile"
            className="inline-block mt-4 px-5 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
          >
            View My Profile
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-300">
            Your profile will be pinned to IPFS and linked on-chain with your
            wallet. Let&apos;s make it awesome!
          </p>
          <ProfileForm onSubmit={handleProfileSubmit} isSubmitting={loading} />
        </>
      )}

      {loading && (
        <div className="flex items-center gap-2 mt-6 text-indigo-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Uploading to IPFS & initializing on Solana...</span>
        </div>
      )}
    </div>
  );
}
