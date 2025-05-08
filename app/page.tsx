"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">Connect. Build. Succeed.</span>
            <span className="block text-indigo-400 mt-2">
              Find the right builders for your project
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            A decentralized platform connecting projects with talented builders
            in the web3 ecosystem.
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

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-[90vw]">
              <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-md bg-indigo-500 text-white flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center">
                  Connect with Builders
                </h3>
                <p className="mt-2 text-sm text-gray-400 text-center">
                  Find talented developers, designers, and marketers for your
                  project.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-md bg-indigo-500 text-white flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center">
                  Showcase Your Skills
                </h3>
                <p className="mt-2 text-sm text-gray-400 text-center">
                  Create a profile and showcase your expertise to potential
                  clients.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-md bg-indigo-500 text-white flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center">
                  Get Paid in Crypto
                </h3>
                <p className="mt-2 text-sm text-gray-400 text-center">
                  Secure, transparent payments through blockchain technology.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome, Builder!</h2>
              <p className="mb-8 text-gray-300">
                Your wallet is connected. What would you like to do next?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <Link
                  href="/dashboard"
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
                  Continue with GitHub Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Social Proof Section */}
        <div className="mt-20 pb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">
              Trusted by Builders From
            </h2>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60">
              <div className="w-40 h-12 flex items-center justify-center">
                <span className="text-lg font-bold">Solana</span>
              </div>
              <div className="w-40 h-12 flex items-center justify-center">
                <span className="text-lg font-bold">Ethereum</span>
              </div>
              <div className="w-40 h-12 flex items-center justify-center">
                <span className="text-lg font-bold">Polygon</span>
              </div>
              <div className="w-40 h-12 flex items-center justify-center">
                <span className="text-lg font-bold">Avalanche</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
