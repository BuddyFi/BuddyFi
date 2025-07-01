/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";
import Footer from "@/components/Footer";
import IsFirstTime from "@/components/data/isFirstTime";
// import IntroSection from "@/components/data/heroSection";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Code2,
  Coffee,
  Github,
  Heart,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { publicKey } = useWallet();
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!publicKey) return;
      
      try {
        const response = await fetch(
          `/api/data?walletAddress=${publicKey.toString()}`
        );
        if (response.ok) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-[#0a0a14] to-[#0f0f25] z-[-9999]">
      <Navbar />

      {/* hero section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <IntroSection />

        
          {!publicKey ? (
            <div>
              <ProblemCards />
              <Features />
              <Steps />
              <Roadmap />
              <Testimonials />
            </div>
          ) : (
            <div>
              <IsFirstTime />
            </div>
          )}
  

        <section className="py-16 container px-4 mx-auto">
          <div className="relative glass-morphism rounded-xl overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-r from-purple-300/20 to-blue-300/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] z-0"></div>
            <div className="relative z-10 p-6 md:p-12 text-center">
              <h2 className="md:text-3xl text-2xl font-bold mb-6">
                Ready to rewrite your hackathon story?
              </h2>
              <p className="md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Join BuddyFi today and connect with talented developers who
                share your vision and complement your skills.
              </p>
              {!publicKey ? (
                <div className="flex  justify-center">
                  <ConnectWalletButton />
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="flex md:flex-row flex-col gap-4">
                    {hasProfile ? (
                      <div>
                        <Link
                          href="/profile"
                          className="flex items-center justify-center p-4 border border-indigo-500 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Manage Profile
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <Link
                          href="/create"
                          className="flex items-center justify-center p-4 border border-indigo-500 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Create Your Decentralized Profile
                        </Link>
                      </div>
                    )}
                    <div>
                      <Link
                        href="/discover"
                        className="flex items-center justify-center p-4 border border-gray-500 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Browse Profiles
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
