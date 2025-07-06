/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  location: string;
  joinedDate: string;
  name: string;
  bio: string;
  portfolio: string;
  languages: string[];
  avatar?: string;
  githubProfile: string;
 
  walletAddress: string;
};

type GithubStats = {
  followers: number;
  public_repos: number;
  totalStars?: number;
  totalCommits?: number;
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
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [allReposFetched, setAllReposFetched] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubActivity, setGithubActivity] = useState<any[]>([]);
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

          // Fetch repositories (default: 10)
          setLoadingRepos(true);
          const reposRes = await fetch("/api/github/repos");
          if (reposRes.ok) {
            const repos = await reposRes.json();
            setGithubRepos(repos);
          }
          setLoadingRepos(false);

          // Fetch activity
          const activityRes = await fetch("/api/github/activity");
          if (activityRes.ok) {
            const activity = await activityRes.json();
            setGithubActivity(activity);
          }
        } else {
          setIsGithubLinked(false);
        }
      } catch {
        setIsGithubLinked(false);
      }
    }
    checkGithub();
  }, []);

  // Handler to show all repos and fetch if needed
  const handleShowAllRepos = async () => {
    if (!allReposFetched) {
      setLoadingRepos(true);
      const res = await fetch("/api/github/repos?all=true");
      if (res.ok) {
        const allRepos = await res.json();
        setGithubRepos(allRepos);
        setAllReposFetched(true);
      }
      setLoadingRepos(false);
    }
    setShowAllRepos((prev) => !prev);
  };

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

  const { name, bio, languages, githubProfile, portfolio } = data;

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
                      src={data?.avatar || "./avatar.avif"}
                      alt={name}
                      className="w-24 h-24 rounded-2xl border-2 border-slate-700"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
                  <p className="text-gray-400 text-sm mb-2">
                    @{data?.githubProfile || "username"}
                  </p>
                  <div className="text-xs text-gray-500 font-mono bg-slate-800/50 rounded-lg px-2 py-1">
                    {data?.walletAddress
                      ? `${data.walletAddress.slice(0, 4)}...${data.walletAddress.slice(-4)}`
                      : ''}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {bio}
                </p>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{data?.location || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon size={14} />
                    <a
                      href={`${portfolio}`}
                      className="text-blue-400 hover:underline"
                    >
                      {portfolio}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Joined {data?.joinedDate || "-"}</span>
                  </div>
                </div>
              </div>

              {/* languages */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code2 size={18} />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((skill, index) => (
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
                      Earned Badges
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="text-gray-400">No badges data</div>
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
                        username={data?.githubProfile || "username"}
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
                    loadingRepos ? (
                      <div className="text-gray-400">Loading repositories...</div>
                    ) : githubRepos.length > 0 ? (
                      (() => {
                        const filteredRepos = githubRepos.filter((repo) => !repo.fork);
                        const displayRepos = showAllRepos ? filteredRepos : filteredRepos.slice(0, 6);
                        return (
                          <>
                            <div className="grid gap-4 mt-4">
                              {displayRepos.map((repo) => (
                                <div key={repo.id} className="bg-slate-800/50 rounded-lg p-4">
                                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-100 font-semibold hover:underline">
                                    {repo.name}
                                  </a>
                                  <p className="text-gray-400 text-sm">{repo.description || 'No description'}</p>
                                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                    <span>⭐ {repo.stargazers_count}</span>
                                    <span>🍴 {repo.forks_count}</span>
                                    <span>{repo.language || 'N/A'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {filteredRepos.length > 6 && (
                              <div className="mt-4 text-center">
                                <Button
                                  className="text-sm px-4 py-2 border border-gray-500 rounded-md text-indigo-300 hover:bg-gray-700 transition bg-transparent"
                                  onClick={handleShowAllRepos}
                                >
                                  {showAllRepos ? 'Show Less' : 'Show All'}
                                </Button>
                              </div>
                            )}
                          </>
                        );
                      })()
                    ) : (
                      <div className="text-gray-400">No repositories data</div>
                    )
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
                    githubActivity.length > 0 ? (
                      <ul className="space-y-4">
                        {githubActivity.map((event, idx) => (
                          <li key={idx} className="text-gray-300 text-sm">
                            <span className="font-semibold">{event.type}</span> in <span className="text-blue-400">{event.repo?.name}</span>
                            <span className="ml-2 text-gray-500">{new Date(event.created_at).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-400">No activity data</div>
                    )
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
