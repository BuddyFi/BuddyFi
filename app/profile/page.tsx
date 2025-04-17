'use client'

import { useWallet } from '@solana/wallet-adapter-react';
import ConnectWalletButton from '@/components/solana/ConnectWalletButton';
import ProfileDisplay from '@/components/ProfileDisplay';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { publicKey } = useWallet();

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        {!publicKey ? (
          <div className="text-center py-10">
            <p className="mb-4">Connect your wallet to view your profile</p>
            <ConnectWalletButton />
          </div>
        ) : (
          <ProfileDisplay />
        )}
      </div>
    </div>
  );
}