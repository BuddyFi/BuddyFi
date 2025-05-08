/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

type IpfsData = {
  name: string;
  bio: string;
  skills: string[];
  avatar?: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  walletAddress: string;
};

export default function ProfileDisplay() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<IpfsData | null>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(({ ipfsData }) => setData(ipfsData))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (data && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [data]);

  if (!publicKey) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Connect your wallet to view your dev profile</p>
        <button className="px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-center">Failed to load profile.</div>;
  }

  const { name, bio, skills, avatar, social, walletAddress } = data;

  return (
    <div
      ref={cardRef}
      className="p-6 space-y-6 text-white bg-gray-900 rounded-xl shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center space-x-5">
        <img
          src={avatar || "/globe.svg"}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm text-gray-400 italic">{bio}</p>
          <p className="text-xs text-gray-500 mt-1">
            Onchain profile • Solana + IPFS powered
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Wallet: {walletAddress.slice(0, 6)}…{walletAddress.slice(-6)}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-sm uppercase text-indigo-400 mb-2 tracking-wide">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 rounded-lg shadow">
        <div className="flex gap-2 items-center">
          <Twitter className="w-4 h-4" />
          <div>@{social.twitter}</div>
        </div>
        <div className="flex gap-2 items-center">
          <Github className="w-4 h-4" />
          <div>@{social.github}</div>
        </div>
        <div className="flex gap-2 items-center">
          <Linkedin className="w-4 h-4" />
          <div>@{social.linkedin}</div>
        </div>
      </div>

      {/* GitHub Section */}
      <div className="pt-4">
        <div className="mt-2">
          <Link
            href={`/dashboard?${social.github}`}
            rel="noreferrer"
            className="inline-block px-4 py-2 border border-indigo-500 rounded-full hover:bg-indigo-500 transition"
          >
            View GitHub Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
