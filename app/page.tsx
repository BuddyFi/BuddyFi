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
      }
    };

    checkProfile();
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-[#0a0a14] to-[#0f0f25] z-[-9999]">
      <Navbar />

      {/* hero section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* <IntroSection /> */}

        {!publicKey ? (
          <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] md:px-4">
            <div className="max-w-5xl mx-auto text-center space-y-12">
              {/* Main Content Card */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="inset-0" />

                <div className="relative md:px-6 py-6 md:p-12">
                  <h1 className="text-3xl md:text-6xl font-black">
                    <div>
                      still shipping  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        solo?
                      </span> 
                    </div>
                    <span>or</span>
                    <div>
                      chasing <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        flaky
                      </span> teamates?🙄
                    </div>
                  </h1>
                 

                  <div className="max-w-xl mx-auto md:my-10 my-2">
                    <p className=" md:text-lg text-sm text-gray-300 leading-relaxed">
                      <span className="font-bold text-white">join buddyfi</span>{" "}
                      — the fastest way to squad up with devs who{" "}
                      <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 md:py-1 rounded-md md:rounded-lg">
                        <Code2 size={16} />
                        code
                      </span>
                      ,{" "}
                      <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 md:py-1 rounded-md md:rounded-lg">
                        <Github size={16} />
                        commit
                      </span>
                      , and{" "}
                      <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 md:py-1 rounded-md md:rounded-lg">
                        <Heart size={16} />
                        actually reply
                      </span>
                      .
                    </p>
                    <p className="md:text-lg text-sm text-gray-400 mt-4">
                      connect your wallet and get matched instantly.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <ConnectWalletButton />
                  </div>

                  <p className="text-sm text-gray-500 mt-6 font-medium">
                    <Coffee className="inline w-4 h-4 mr-1" />
                    no forms. no fluff. just builders like you.
                  </p>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/30 transition-all duration-300 hover:scale-105">
                  <div className="md:w-14 w-10 md:h-14 h-10 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="text-green-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Verified Skills
                  </h3>
                  <p className="text-gray-400 md:text-md text-sm">
                    On-chain proof of your coding abilities. No more fake 10x
                    claims.
                  </p>
                </div>

                <div className="group bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/30 transition-all duration-300 hover:scale-105">
                  <div className="md:w-14 w-10 md:h-14 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="text-purple-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Instant Matching
                  </h3>
                  <p className="text-gray-400 md:text-md text-sm">
                    Find your perfect teammate in seconds, not hours of Discord
                    scrolling.
                  </p>
                </div>

                <div className="group bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/30 transition-all duration-300 hover:scale-105">
                  <div className="md:w-14 w-10 md:h-14 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform">
                    <Users className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Real Builders
                  </h3>
                  <p className="text-gray-400 md:text-md text-sm">
                    No ghost teammates. Just committed devs who show up and
                    ship.
                  </p>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div>
            <div>
              {/* Wallet Connected State */}
              <div className="max-w-5xl mx-auto text-center space-y-12">
                {/* Success Animation */}
                <div className="relative">
                  <div className="inset-0 rounded-3xl" />

                  <div className="relative backdrop-blur-xl md:p-12">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="md:w-24 w-16 md:h-24 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                          <CheckCircle className="text-green-400" size={48} />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 animate-ping" />
                      </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        you&apos;re in.
                      </span>
                      <br />
                      <span className="text-gray-300">
                        now let&apos;s find your perfect
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        hack buddy
                      </span>
                      <span className="text-5xl ml-2">🛠️</span>
                    </h1>

                    <div className="max-w-3xl md:mx-auto mb-10">
                      <p className="md:text-lg text-sm text-gray-300 leading-relaxed">
                        your wallet&apos;s{" "}
                        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 md:py-1 md:rounded-lg rounded-md">
                          <CheckCircle size={16} />
                          locked
                        </span>
                        . your vibe&apos;s{" "}
                        <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 md:py-1 md:rounded-lg rounded-md">
                          <Sparkles size={16} />
                          loaded
                        </span>
                        .
                      </p>
                      <p className="text-gray-400 md:text-md text-sm mt-4">
                        head to your dashboard and start matching with devs who
                        mean{" "}
                        <span className="text-blue-400">
                          business
                        </span>{" "}
                        (and{" "}
                        <span className="text-yellow-400">
                          memes
                        </span>
                        ).
                      </p>
                    </div>

                    <Link href="/profile">
                    <Button
                    variant={"outline"}>

                      Go to dashboard
                      <ArrowRight
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                        size={20}
                        />
                        </Button>
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-6">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>
                        ready to match with{" "}
                        {Math.floor(Math.random() * 500) + 200}+ active builders
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Stats */}
                {/* <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-green-400 mb-2">
                      2.8k+
                    </div>
                    <p className="text-gray-400 text-sm">Active Devs</p>
                  </div>

                  <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-blue-400 mb-2">
                      947
                    </div>
                    <p className="text-gray-400 text-sm">Teams Formed</p>
                  </div>

                  <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-purple-400 mb-2">
                      <Trophy className="inline w-8 h-8 mr-1" />
                      203
                    </div>
                    <p className="text-gray-400 text-sm">Hackathon Wins</p>
                  </div>

                  <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-yellow-400 mb-2 flex items-center justify-center">
                      <Clock className="w-8 h-8 mr-1" />
                      <span className="animate-pulse">LIVE</span>
                    </div>
                    <p className="text-gray-400 text-sm">Matching Now</p>
                  </div>
                </div> */}
              </div>
            </div>
            <IsFirstTime />
          </div>
        )}

        <section className="pt-16 container md:px-4 mx-auto">
          <div className="relative md:rounded-xl rounded-md overflow-hidden">
            <div className="absolute"></div>
            <div className="relative z-10 p-6 md:p-12 text-center bg-slate-900/60 backdrop-blur-xl border-2 border-slate-800/50">
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
