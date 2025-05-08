/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useWallet } from "@solana/wallet-adapter-react";

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
    <div ref={cardRef} className="p-6 space-y-4 text-white bg-gray-900 rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={avatar || "/default-avatar.png"}
          alt={name}
          className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm text-gray-400">
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-6)}
          </p>
        </div>
      </div>

      <p className="text-gray-200">{bio}</p>

      <div>
        <h3 className="text-sm uppercase text-indigo-400 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-700 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        {social.twitter && (
          <a
            href={`https://twitter.com/${social.twitter}`}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition"
          >
            <img src="/icons/twitter.svg" className="w-6 h-6" />
          </a>
        )}
        {social.linkedin && (
          <a
            href={`https://linkedin.com/in/${social.linkedin}`}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-75 transition"
          >
            <img src="/icons/linkedin.svg" className="w-6 h-6" />
          </a>
        )}
      </div>

      {social.github ? (
        <a
          href={`/dashboard?${social.github}`}
          rel="noreferrer"
          className="inline-block px-4 py-2 border border-indigo-500 rounded-full hover:bg-indigo-500 transition"
        >
          View GitHub Profile
        </a>
      ) : (
        <button
          onClick={() => {
            /* trigger your GitHub OAuth/link flow */
          }}
          className="w-full px-4 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition"
        >
          Connect GitHub
        </button>
      )}
    </div>
  );
}
