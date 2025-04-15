"use client";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletButton() {
  const { connect, disconnect, publicKey } = useWallet();

  return (
    <button
      onClick={() => (publicKey ? disconnect() : connect())}
      className="bg-purple-500 text-white px-4 py-2 rounded"
    >
      {publicKey
        ? `Connected: ${publicKey.toBase58().slice(0.6)}...`
        : "Connect Wallet"}
    </button>
  );
}
