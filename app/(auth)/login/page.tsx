"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { initializeProfile } from "@/lib/solana/profile";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";

export default function ProfileCreator() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");

  if(!publicKey) {
    return(
      <div>
    <Navbar/>
    <div className="max-w-md mx-auto mt-20 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Login Page</h1>
      <ConnectWalletButton/>
    </div>
  </div>
    )
  }

  const handleCreateProfile = async () => {
    if (!publicKey || !signTransaction) {
      console.log("pubkey:", publicKey);
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTxId("");

      const txSignature = await initializeProfile(
        connection,
        publicKey,
        sendTransaction
      );
      setTxId(txSignature);
      console.log(`Transaction successful! signature: ${txSignature}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:max-w-md mx-auto w-[90vw] mt-20 md:p-6 p-4 bg-gray-300 rounded-lg">
        <Navbar/>
      <h1 className="text-2xl mb-4 text-gray-800 font-semibold">
        Create Profile
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* https://explorer.solana.com/address/95qSp5voZCaQHynU3Gj15yTwRcFC7HBynrtqcoL3xij4?cluster=devnet */}
      {txId ? (
        <div className="text-green-600">
          <p>Profile created successfully!</p>
          <Link
            href={`https://explorer.solana.com/address/${txId}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline mt-2 inline-block"
          >
            View Transaction
          </Link>
        </div>
      ) : (
        <button
          onClick={handleCreateProfile}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700
                disabled:bg-gray-400 transition-colors cursor-pointer"
        >
          {loading ? "Creating..." : "Create Profile (0.05 SOL)"}
        </button>
      )}
    </div>
  );
}
