"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProblemCards from "@/components/data/problemCards";
import Features from "@/components/data/features";
import Steps from "@/components/data/steps";
import Roadmap from "@/components/data/roadmap";
import Testimonials from "@/components/data/testimonials";
import IsFirstTime from "@/components/data/isFirstTime";
import IntroSection from "@/components/data/heroSection";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen ">
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
        

        <section className="py-16  container px-4 mx-auto">
          <div className="relative glass-morphism rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/20 to-blue-300/10 z-0"></div>
            <div className="relative z-10 p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to rewrite your hackathon story?
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
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
