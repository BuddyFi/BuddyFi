"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div>
      <Navbar />

      {!publicKey ? (
        <div className="max-w-md mx-auto mt-20 p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Login Page</h1>
          <ConnectWalletButton />
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-20 p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Landing Page</h1>
          <Link href="/create" className="p-2 border rounded">Create your profile</Link>
        </div>
      )}
    </div>
  );
}
