'use client';
import Navbar from '@/components/Navbar';
import ProfileCreator from '@/components/ProfileCreator';
import BuddyfiLoading from '@/components/buddyfi-loading';
import { useState } from 'react';

export default function CreateProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white flex flex-col items-center justify-center py-12 px-4">
      <Navbar />
      <div className="w-full max-w-4xl">
        <BuddyfiLoading isLoading={isLoading}>
          <ProfileCreator onLoadingChange={setIsLoading} />
        </BuddyfiLoading>
      </div>
    </div>
  );
}