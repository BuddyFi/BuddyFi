/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { initializeProfile } from "@/lib/solana/profile";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { setCID } from "@/utils/cidStore";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ProfileCreatorProps {
  onLoadingChange?: (loading: boolean) => void;
}

export default function ProfileCreator({ onLoadingChange }: ProfileCreatorProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [ipfsCid, setIpfsCid] = useState("");

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const handleProfileSubmit = async (formData: any) => {
    if (!publicKey || !wallet?.adapter) {
      setError("Wallet not connected or invalid adapter");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          walletAddress: publicKey.toBase58(),
        }),
      });

      const { cid, error } = await res.json();
      if (error) throw new Error(error);

      setCID(cid);
      setIpfsCid(cid);

      const txSignature = await initializeProfile(
        connection,
        publicKey,
        sendTransaction,
        cid,
        formData.skills || ["nextjs", "solana"]
      );

      setTxId(txSignature);
    } catch (err) {
      console.error("Profile creation error:", err);
      setError(
        err instanceof Error ? err.message : "Profile creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-800 rounded-lg shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-indigo-400">Connect Your Wallet</h1>
        <p className="text-gray-300">
          To create your BuddyFi profile, please connect your Solana wallet.
        </p>
        <ConnectWalletButton />
      </div>
    );
  }

  if (txId) {
    return (
      <div className="p-8 bg-green-700/30 border border-green-600 rounded-lg text-white space-y-4">
        <div className="flex items-center gap-3 text-green-400 text-2xl font-semibold">
          <CheckCircle className="w-6 h-6" />
          <h2>Profile Created Successfully!</h2>
        </div>
        <p className="text-gray-300">
          Your profile is now live on-chain and stored on IPFS.
        </p>
        <div>
          <div className="font-semibold text-gray-200">Transaction:</div>
          <a
            href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 underline break-words text-sm"
          >
            {txId}
          </a>
        </div>
        <div>
          <div className="font-semibold text-gray-200">IPFS CID:</div>
          <span className="font-mono text-sm break-words text-gray-300">
            {ipfsCid}
          </span>
        </div>
        <Link
          href="/profile"
          className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          View My Profile
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-700/30 border border-red-600 rounded-lg text-white space-y-4">
        <div className="flex items-center gap-3 text-red-400 text-2xl font-semibold">
          <AlertCircle className="w-6 h-6" />
          <h2>Profile Creation Failed</h2>
        </div>
        <p className="text-gray-300">{error}</p>
        {/* Optionally add a retry button or guidance */}
      </div>
    );
  }

  // Main form view
  return (
    <div className="p-8 bg-zinc-800 rounded-lg shadow-xl text-white space-y-6">
      <h1 className="text-3xl font-bold text-indigo-400 text-center">🚀 Create Your BuddyFi Profile</h1>
      <p className="text-gray-300 text-center">
        Your profile will be pinned to IPFS and linked on-chain with your wallet. Let&apos;s make it awesome!
      </p>
      <ProfileForm onSubmit={handleProfileSubmit} isSubmitting={loading} />
    </div>
  );
}
