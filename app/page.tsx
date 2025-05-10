"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";
import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          {/* <div className="inline-block mb-4">
            <span className="px-3 py-1 rounded-full bg-purple-300/10 text-purple-300 text-sm font-medium">
              ⚡ Now on Solana Mainnet
            </span>
          </div> */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">Connect. Build. Succeed.</span>
            <span className="block bg-gradient-to-br from-purple-300 via-sky-400 to-gray-50 bg-clip-text text-transparent mt-2">
              Find the right builders for your project
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            BuddyFi matches developers with the perfect teammates for
            hackathons, using on-chain profiles, skill matching, and a familiar
            swipe-to-connect interface.
          </p>
        </div>

        {!publicKey ? (
          <>
            <div className="mt-10 max-w-lg mx-auto">
              <div className="max-w-lg mx-auto text-center">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700">
                  <h2 className="text-2xl font-bold mb-6">
                    Connect Your Wallet
                  </h2>
                  <p className="mb-6 text-gray-300">
                    Connect your Solana wallet to access the platform and find
                    or become a builder.
                  </p>
                  <div className="flex justify-center">
                    <ConnectWalletButton />
                  </div>
                </div>
              </div>
            </div>

            <section className="py-16 container px-4 mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How BuddyFi Works</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Connect your wallet, create your developer profile, and find
                  your perfect hackathon teammate in minutes
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    ),
                    title: "Connect Wallet",
                    description:
                      "Link your Solana wallet to secure your profile and enable on-chain interactions",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
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
                    ),
                    title: "Build Profile",
                    description:
                      "Showcase your skills, experience, timezone, and availability to attract the right teammates",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    ),
                    title: "Match & Connect",
                    description:
                      "Swipe through potential teammates, match based on compatibility, and start collaborating",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-6 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-300/10 text-purple-300 mb-5">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome, Builder!</h2>
              <p className="mb-8 text-gray-300">
                Your wallet is connected. What would you like to do next?
              </p>

              <div className="flex justify-center">
                <Link
                  href="/create"
                  className="flex items-center justify-center p-4 border border-indigo-500 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium text-sm w-[50%]"
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
            </div>
          </div>
        )}

        <section className="py-16 container px-4 mx-auto">
          <div className="relative glass-morphism rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/20 to-blue-300/10 z-0"></div>
            <div className="relative z-10 p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to find your hackathon dream team?
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Join BuddyFi today and connect with talented developers who
                share your vision and complement your skills.
              </p>
              {!publicKey ? (
                <div className="flex justify-center">
                  <ConnectWalletButton />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Link
                    href="/discover"
                    className="flex items-center justify-center px-4 py-2 border border-gray-500 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium text-sm w-[20%]"
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
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
