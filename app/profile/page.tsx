/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import gsap from "gsap";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Navbar from "@/components/Navbar";
import BuddyfiLoading from "@/components/buddyfi-loading";
import { toast } from "sonner";
import { getDefaultProfile, ProfileData } from "@/services/profileService";
import {
  Github,
  Star,
  GitFork,
  Calendar,
  MapPin,
  LinkIcon,
  Trophy,
  Zap,
  Code2,
  Users,
  Activity,
  BookOpen,
  Target,
  Crown,
  Heart,
  Settings,
  Bell,
  Search,
  Filter,
  ExternalLink,
  GitCommit,
  GitPullRequest,
  Eye,
} from "lucide-react";
import GithubContributions from "@/components/GithubContributions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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

type GithubStats = {
  followers: number;
  public_repos: number;
  totalStars?: number;
  totalCommits?: number;
};

// Mock user data
const userData = {
  name: "Alex Chen",
  username: "alexdev",
  walletAddress: "0x1234...5678",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Full-stack developer passionate about Web3 and DeFi. Building the future one commit at a time.",
  location: "San Francisco, CA",
  website: "alexchen.dev",
  joinedDate: "March 2023",
  githubStats: {
    followers: 1247,
    following: 342,
    publicRepos: 87,
    totalStars: 2341,
    totalCommits: 1856,
    contributionsThisYear: 847,
  },
  skills: ["React", "TypeScript", "Solidity", "Node.js", "Python", "GraphQL"],
  badges: [
    {
      id: 1,
      name: "Early Adopter",
      icon: Crown,
      color: "text-yellow-400",
      description: "Joined BuddyFi in beta",
    },
    {
      id: 2,
      name: "Team Player",
      icon: Users,
      color: "text-blue-400",
      description: "Formed 5+ successful teams",
    },
    {
      id: 3,
      name: "Hackathon Hero",
      icon: Trophy,
      color: "text-purple-400",
      description: "Won 3 hackathons",
    },
    {
      id: 4,
      name: "Code Warrior",
      icon: Zap,
      color: "text-green-400",
      description: "500+ commits this year",
    },
    {
      id: 5,
      name: "Open Source",
      icon: Heart,
      color: "text-red-400",
      description: "10+ OSS contributions",
    },
    {
      id: 6,
      name: "Mentor",
      icon: Target,
      color: "text-orange-400",
      description: "Helped 20+ developers",
    },
  ],
  recentRepos: [
    {
      name: "defi-yield-optimizer",
      description:
        "Smart contract suite for optimizing DeFi yield farming strategies",
      language: "Solidity",
      stars: 234,
      forks: 45,
      updatedAt: "2 days ago",
      isPrivate: false,
    },
    {
      name: "web3-auth-sdk",
      description: "TypeScript SDK for seamless Web3 authentication",
      language: "TypeScript",
      stars: 156,
      forks: 23,
      updatedAt: "5 days ago",
      isPrivate: false,
    },
    {
      name: "nft-marketplace-dapp",
      description:
        "Full-stack NFT marketplace with React frontend and smart contracts",
      language: "JavaScript",
      stars: 89,
      forks: 12,
      updatedAt: "1 week ago",
      isPrivate: false,
    },
    {
      name: "crypto-portfolio-tracker",
      description: "Real-time cryptocurrency portfolio tracking application",
      language: "Python",
      stars: 67,
      forks: 8,
      updatedAt: "2 weeks ago",
      isPrivate: true,
    },
  ],
  contributionData: [
    { date: "2024-01", commits: 45 },
    { date: "2024-02", commits: 67 },
    { date: "2024-03", commits: 89 },
    { date: "2024-04", commits: 123 },
    { date: "2024-05", commits: 98 },
    { date: "2024-06", commits: 156 },
    { date: "2024-07", commits: 134 },
    { date: "2024-08", commits: 178 },
    { date: "2024-09", commits: 145 },
    { date: "2024-10", commits: 167 },
    { date: "2024-11", commits: 189 },
    { date: "2024-12", commits: 203 },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { publicKey } = useWallet();
  const cardRef = useRef(null);
  const [data, setData] = useState<IpfsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>(
    getDefaultProfile()
  );

  const [isGithubLinked, setIsGithubLinked] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);
  const router = useRouter();

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      Solidity: "bg-purple-500",
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-500",
      Rust: "bg-orange-500",
      Go: "bg-cyan-500",
    };
    return colors[language] || "bg-gray-500";
  };
  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/data?walletAddress=${publicKey.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setData(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [publicKey]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [publicKey]);

  useEffect(() => {
    if (data && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [data]);

  // Check if GitHub is linked (e.g., via cookie or API)
  useEffect(() => {
    async function checkGithub() {
      try {
        const res = await fetch("/api/github/user");
        if (res.ok) {
          const data = await res.json();
          setGithubStats(data);
          setIsGithubLinked(true);
        } else {
          setIsGithubLinked(false);
        }
      } catch {
        setIsGithubLinked(false);
      }
    }
    checkGithub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 mt-16 text-center border border-red-200 rounded-xl max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2 text-red-500">
          No Profile Found
        </h2>
        <p className="text-gray-400 mb-4">
          Please connect your wallet to view your profile
        </p>
        <ConnectWalletButton />
      </div>
    );
  } 

    const { name, bio, skills, social } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-buddyfi-background to-buddyfi-background/80">
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-16">
        <div ref={cardRef} className="max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] rounded-2xl md:p-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Left Column - Profile Info */}
              <div className="flex md:flex-col flex-row items-center md:items-start gap-8">
                <div className="relative group">
                  <div className="md:h-40 md:w-40 h-20 w-20 rounded-2xl overflow-hidden border-4 border-purple-500/20 shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src="./avatar.avif"
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h1 className="md:text-3xl text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{name}</h1>
                      <p className="text-gray-400 mt-1 text-sm">{profileData.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="md:col-span-2 space-y-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <h2 className="text-xl font-bold mb-4 text-purple-300">About</h2>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">{bio}</p>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <h2 className="text-xl font-bold mb-4 text-purple-300">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        className="skill-tag bg-purple-300/20 text-purple-300 border border-purple-300/30 hover:bg-purple-300/30 transition-colors duration-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <h2 className="text-xl font-bold mb-4 text-purple-300">Contact</h2>
                  <div className="space-y-3">
                    <a
                      href={`https://github.com/${social.github}`}
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-purple-300 transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      {social.github}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:gap-6 gap-4">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="font-medium mb-4 text-purple-300">Availability</h3>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-1.5">
                      {profileData.availability}
                    </Badge>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="font-medium mb-4 text-purple-300">Role</h3>
                    {social.github ? (
                      <div>Developer</div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400">
                          No GitHub activity to show
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
