'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import gsap from 'gsap';
import ConnectWalletButton from '@/components/solana/ConnectWalletButton';
import Navbar from '@/components/Navbar';
import ProfileDisplay from '@/components/ProfileDisplay';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
        {!publicKey ? (
          <div className="text-center bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl">
            <p className="mb-4 text-lg">Connect your wallet to view your dev profile</p>
            <ConnectWalletButton />
          </div>
        ) : (
          <div ref={cardRef}>
            <ProfileDisplay />
          </div>
        )}
      </div>
    </div>
  );
}
