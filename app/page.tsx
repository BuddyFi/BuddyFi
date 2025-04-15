"use client";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";

export default function Home() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push("/login");
    }
  }, [publicKey, router]);
  return (
  <div>
    <Navbar/>
    <div className="max-w-md mx-auto mt-20 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Login Page</h1>
      <ConnectWalletButton/>
    </div>
  </div>
  )
}
