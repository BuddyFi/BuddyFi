'use client';
import Navbar from '@/components/Navbar';
import ProfileCreator from '@/components/ProfileCreator';

export default function CreateProfilePage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ProfileCreator />
      </div>
    </div>
  );
}