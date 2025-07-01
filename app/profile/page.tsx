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
// import ProfileDisplay from "@/components/ProfileDisplay";
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
    if (!publicKey) return;
    fetch(`/api/data?walletAddress=${publicKey.toString()}`)
      .then((res) => res.json())
      .then(({ profileData }) => setData(profileData))
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      })
      .finally(() => setLoading(false));
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
      <div className="absolute md:left-[40%] left-2 md:top-5 top-17 z-80">
        <nav className="flex items-center md:gap-6 gap-2 my-1-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 md:py-2 py-1 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("repositories")}
            className={`px-3 md:py-2 py-1 rounded-lg transition-colors ${
              activeTab === "repositories"
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Repositories
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-3 md:py-2 py-1 rounded-lg transition-colors ${
              activeTab === "activity"
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Activity
          </button>
        </nav>
      </div>
      <div className="my-20">
        <main className="relative z-10 container mx-auto md:px-4 px-2 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Profile */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 md:rounded-2xl rounded-md md:p-6 p-4">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src="./avatar.avif"
                      alt={name}
                      className="w-24 h-24 rounded-2xl border-2 border-slate-700"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
                  <p className="text-gray-400 text-sm mb-2">
                    @{userData.username}
                  </p>
                  <div className="text-xs text-gray-500 font-mono bg-slate-800/50 rounded-lg px-2 py-1">
                    {userData.walletAddress}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {bio}
                </p>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon size={14} />
                    <a
                      href={`https://${userData.website}`}
                      className="text-blue-400 hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Joined {userData.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code2 size={18} />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub Stats */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Github size={18} />
                  GitHub Stats
                </h3>
                {!isGithubLinked ? (
                  <div className="flex flex-col items-center justify-center">
                    <Dialog
                      open={showGithubModal}
                      onOpenChange={setShowGithubModal}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Link GitHub
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sign in with GitHub</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 text-center">
                          <a
                            href="/api/github/login"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Sign in with GitHub
                          </a>
                        </div>
                        <DialogClose asChild>
                          <Button
                            variant={"outline"}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-gray-100 hover:bg-gray-300"
                          >
                            Close
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : githubStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {githubStats.followers}
                      </div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {githubStats.public_repos}
                      </div>
                      <div className="text-xs text-gray-400">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {githubStats.totalStars || "-"}
                      </div>
                      <div className="text-xs text-gray-400">Stars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {githubStats.totalCommits || "-"}
                      </div>
                      <div className="text-xs text-gray-400">Commits</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Loading GitHub stats...</div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {activeTab === "overview" && (
                <>
                  {/* Badges Section */}
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Trophy size={20} />
                      Earned Badges{" "}
                      <span className="text-sm text-gray-300 font-medium ml-2">
                        ( This data is hardcoded )
                      </span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userData.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="group bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/30 transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center ${badge.color}`}
                            >
                              <badge.icon size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">
                                {badge.name}
                              </h4>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contribution Graph */}
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Activity size={20} />
                      Contribution Activity
                    </h3>
                    <div className="mb-4">
                      {/* Real GitHub Contribution Graph */}
                      <GithubContributions
                        username={data?.social?.github || userData.username}
                        days={30}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "repositories" && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen size={20} />
                    Recent Repositories
                  </h3>
                  {!isGithubLinked ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Dialog
                        open={showGithubModal}
                        onOpenChange={setShowGithubModal}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Link GitHub
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sign in with GitHub</DialogTitle>
                          </DialogHeader>
                          <div className="p-4 text-center">
                            <a
                              href="/api/github/login"
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Sign in with GitHub
                            </a>
                          </div>
                          <DialogClose asChild>
                            <Button
                              variant={"outline"}
                              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-gray-100 hover:bg-gray-300"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Filter size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Search size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {userData.recentRepos.map((repo, index) => (
                          <div
                            key={index}
                            className="group bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-700/30 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <BookOpen
                                  size={18}
                                  className="text-blue-400 mt-0.5"
                                />
                                <div>
                                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                    {repo.name}
                                  </h4>
                                  {repo.isPrivate && (
                                    <span className="inline-block px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full mt-1">
                                      Private
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ExternalLink size={14} />
                              </Button>
                            </div>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                              {repo.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`w-3 h-3 rounded-full ${getLanguageColor(
                                      repo.language
                                    )}`}
                                  />
                                  <span>{repo.language}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star size={14} />
                                  <span>{repo.stars}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <GitFork size={14} />
                                  <span>{repo.forks}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                Updated {repo.updatedAt}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} />
                    Recent Activity
                  </h3>
                  {!isGithubLinked ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Dialog
                        open={showGithubModal}
                        onOpenChange={setShowGithubModal}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Link GitHub
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sign in with GitHub</DialogTitle>
                          </DialogHeader>
                          <div className="p-4 text-center">
                            <a
                              href="/api/github/login"
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Sign in with GitHub
                            </a>
                          </div>
                          <DialogClose asChild>
                            <Button
                              variant={"outline"}
                              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-gray-100 hover:bg-gray-300"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <GitCommit size={16} className="text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              Pushed 3 commits to{" "}
                              <span className="text-blue-400">
                                defi-yield-optimizer
                              </span>
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <GitPullRequest
                              size={16}
                              className="text-purple-400"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              Opened pull request in{" "}
                              <span className="text-blue-400">
                                web3-auth-sdk
                              </span>
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              5 hours ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Star size={16} className="text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              Starred{" "}
                              <span className="text-blue-400">
                                ethereum/solidity
                              </span>
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              1 day ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Eye size={16} className="text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              Started watching{" "}
                              <span className="text-blue-400">
                                OpenZeppelin/openzeppelin-contracts
                              </span>
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
