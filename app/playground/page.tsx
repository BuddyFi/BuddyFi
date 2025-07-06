/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Code2,
  Trophy,
  Github,
  Lightbulb,
  Users,
  Sparkles,
  MessageSquare,
  Wallet,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ProfileCreatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Origin Story
    name: "",
    bio: "",

    // Step 2: Skill Stack
    languages: [] as string[],
    domains: [] as string[],
    otherDomain: "",
    skillLevel: "intermediate",

    // Step 3: Hackathon Chronicles
    hackathonsAttended: "",
    hackathonWins: "",
    favoriteMemory: "",
    codingFrequency: "daily",
    proudestMoment: "",

    // Step 4: Proof of Work
    githubProfile: "",
    portfolio: "",
    linkedin: "",
    twitter: "",
    projectLinks: "",

    // Step 5: Developer Prompts
    dreamProject: "",
    twoTruthsOneLie: "",

    // Step 6: Team Vibe
    idealTeammate: "",
    pairProgrammingStyle: "banter",
    openToSideProjects: false,

    // Step 7: Dev Mascot
    mascot: "code-dragon",
    mascotDescription: "",

    // Step 8: Final Words
    finalMessage: "",
    readyToMatch: false,
  });

  const totalSteps = 8;

  const languageOptions = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Solidity",
    "Rust",
    "Go",
    "Java",
    "C++",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Next.js",
    "Express",
    "Django",
    "Flask",
    "Web3.js",
    "Ethers.js",
    "Hardhat",
    "Truffle",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
  ];

  const domainOptions = [
    "Frontend",
    "Backend",
    "Web3 / Blockchain",
    "AI/ML",
    "DevOps",
    "Game Dev",
    "Mobile",
    "Data Science",
    "Cybersecurity",
  ];

  const mascotOptions = [
    {
      id: "code-dragon",
      name: "Code Dragon",
      emoji: "🐉",
      description: "Fierce and focused",
    },
    {
      id: "bug-hunter",
      name: "Bug Hunter",
      emoji: "🕵️",
      description: "Detective of errors",
    },
    {
      id: "terminal-goblin",
      name: "Terminal Goblin",
      emoji: "👹",
      description: "Command line wizard",
    },
    {
      id: "pixel-phoenix",
      name: "Pixel Phoenix",
      emoji: "🔥",
      description: "Rising from crashes",
    },
    {
      id: "crypto-cat",
      name: "Crypto Cat",
      emoji: "🐱",
      description: "Blockchain curious",
    },
    {
      id: "api-ninja",
      name: "API Ninja",
      emoji: "🥷",
      description: "Silent but deadly",
    },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev) => {
      const value = prev[field as keyof typeof prev];

      // Narrow type to only work with arrays
      if (Array.isArray(value)) {
        return {
          ...prev,
          [field]: value.includes(item)
            ? value.filter((i) => i !== item)
            : [...value, item],
        };
      }

      // If not array, return unchanged
      return prev;
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Profile data:", formData);
    // Here you would submit to blockchain/backend
    alert("Profile created successfully! 🎉");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-2">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <User className="text-blue-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  The Origin Story
                </h2>
              </div>
              <p className="text-gray-400">
                Every hacker has a beginning. Tell us yours.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Name or Alias <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  What do your teammates call you?
                </p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Alex Chen, CryptoWizard, 0xBuilder..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Developer Bio <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  In a few lines, tell us who you are, your journey into code,
                  and what drives you. This is your story.
                </p>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Started coding at 12 with Python, fell in love with blockchain during college. Now building DeFi tools that make crypto accessible to everyone. When I'm not coding, I'm probably at a hackathon or teaching others to code..."
                  rows={6}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.bio.length}/300 characters
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Code2 className="text-green-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Skill Stack</h2>
              </div>
              <p className="text-gray-400">
                Your dev toolkit is your superpower. Show it off.
              </p>
            </div>

            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Languages & Frameworks You Know
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  List what you use to build magic — from HTML to Rust, from
                  React to Solana.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleArrayItem("languages", lang)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.languages.includes(lang)
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                          : "bg-slate-800/50 text-gray-400 border border-slate-700 hover:bg-slate-700/50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Tech Domains You Love
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {domainOptions.map((domain) => (
                      <label
                        key={domain}
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => toggleArrayItem("domains", domain)}
                      >
                        <div
                          className={`w-5 h-5 rounded-xs border flex items-center justify-center transition 
                         ${
                           formData.domains.includes(domain)
                             ? "bg-violet-500 border-violet-400"
                             : "bg-slate-400 border-slate-500"
                         }`}
                        >
                          {formData.domains.includes(domain) && (
                            <Check className="w-4 h-4 text-white bg-blue-800" />
                          )}
                        </div>

                        <span className="text-gray-300">{domain}</span>
                      </label>
                    ))}
                  </div>
                  {/* <input
                    type="text"
                    value={formData.otherDomain}
                    onChange={(e) =>
                      updateFormData("otherDomain", e.target.value)
                    }
                    placeholder="Other domain..."
                    className="w-full mt-6 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  /> */}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Comfort Level
                  </label>
                  <p className="text-gray-400 text-sm mb-3">
                    How confident are you in your skills?
                  </p>
                  <div className="flex gap-4">
                    {[
                      {
                        id: "beginner",
                        label: "🔘 Beginner",
                        desc: "Learning the ropes",
                      },
                      {
                        id: "intermediate",
                        label: "🟡 Intermediate",
                        desc: "Getting things done",
                      },
                      {
                        id: "pro",
                        label: "🟢 Pro Hacker",
                        desc: "Building the future",
                      },
                    ].map((level) => (
                      <button
                        key={level.id}
                        onClick={() => updateFormData("skillLevel", level.id)}
                        className={`flex-1 p-4 rounded-xl border transition-all ${
                          formData.skillLevel === level.id
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-slate-800/50 border-slate-700 text-gray-400 hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="text-lg mb-1">{level.label}</div>
                        <div className="text-xs">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Trophy className="text-yellow-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Hackathon Chronicles
                </h2>
              </div>
              <p className="text-gray-400">
                The arena of ideas — where have you fought, and how did it go?
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Hackathons Attended
                  </label>
                  <input
                    type="number"
                    value={formData.hackathonsAttended}
                    onChange={(e) =>
                      updateFormData("hackathonsAttended", e.target.value)
                    }
                    placeholder="5"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Wins / Special Mentions
                  </label>
                  <input
                    type="number"
                    value={formData.hackathonWins}
                    onChange={(e) =>
                      updateFormData("hackathonWins", e.target.value)
                    }
                    placeholder="2"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Coding Frequency
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: "daily", label: "Daily 💻", desc: "Code is life" },
                      {
                        id: "weekly",
                        label: "Few times a week ⏰",
                        desc: "Regular grind",
                      },
                      {
                        id: "weekends",
                        label: "Weekends only 🌙",
                        desc: "Weekend warrior",
                      },
                      {
                        id: "rarely",
                        label: "Rarely 😴",
                        desc: "When inspiration strikes",
                      },
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        onClick={() =>
                          updateFormData("codingFrequency", freq.id)
                        }
                        className={`p-3 rounded-xl border transition-all text-center ${
                          formData.codingFrequency === freq.id
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-slate-800/50 border-slate-700 text-gray-400 hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="text-sm mb-1">{freq.label}</div>
                        <div className="text-xs">{freq.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Favorite Hackathon Memory
                    </label>
                    <p className="text-gray-400 text-sm mb-3">
                      What&pos;s one unforgettable hackathon moment?
                    </p>
                    <textarea
                      value={formData.favoriteMemory}
                      onChange={(e) =>
                        updateFormData("favoriteMemory", e.target.value)
                      }
                      placeholder="Building our first DeFi protocol at ETHGlobal, debugging smart contracts at 3 AM with energy drinks and pure determination..."
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Proudest Hackathon Moment
                    </label>
                    <p className="text-gray-400 text-sm mb-3">
                      Tell us your proudest hackathon moment. (~40-50 words)
                    </p>
                    <textarea
                      value={formData.proudestMoment}
                      onChange={(e) =>
                        updateFormData("proudestMoment", e.target.value)
                      }
                      placeholder="Won first place at ETHDenver with a zero-knowledge voting system. Seeing our idea come to life and judges' excitement was incredible..."
                      rows={3}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Github className="text-purple-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Proof of Work</h2>
              </div>
              <p className="text-gray-400">
                Show, don&apos;t tell. Drop your links.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    GitHub Profile <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.githubProfile}
                      onChange={(e) =>
                        updateFormData("githubProfile", e.target.value)
                      }
                      placeholder="Enter your username only"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Twitter / X <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => updateFormData("twitter", e.target.value)}
                    placeholder="Enter your username only"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    LinkedIn (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => updateFormData("linkedin", e.target.value)}
                    placeholder="Enter your username only"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Portfolio / Website
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) =>
                        updateFormData("portfolio", e.target.value)
                      }
                      placeholder="https://yourportfolio.dev"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Anything you&apos;re proud of?
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Project links, demos, or anything that showcases your work
                </p>
                <textarea
                  value={formData.projectLinks}
                  onChange={(e) =>
                    updateFormData("projectLinks", e.target.value)
                  }
                  placeholder="https://myawesomeproject.com - DeFi yield optimizer&#10;https://github.com/me/nft-marketplace - NFT marketplace with 1k+ users&#10;https://devpost.com/software/my-hackathon-project"
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Lightbulb className="text-cyan-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Developer Prompts
                </h2>
              </div>
              <p className="text-gray-400">
                Let your personality shine through
              </p>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="block text-white font-semibold mb-2">
                  &quot;If I could build anything right now, it&apos;d
                  be...&quot;
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  E.g. &quot;A Discord bot that auto-grants bragging rights for
                  hackathon wins.&quot;
                </p>
                <textarea
                  value={formData.dreamProject}
                  onChange={(e) =>
                    updateFormData("dreamProject", e.target.value)
                  }
                  placeholder="A decentralized social network where your reputation is built on code contributions, not follower count. Imagine GitHub meets Twitter but on-chain..."
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  &quot;Two truths and a lie about my dev life...&quot;
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  E.g. &quot;1. I&apos;ve shipped production code at 3 AM; 2. I
                  won a hackathon with no sleep;
                </p>
                <textarea
                  value={formData.twoTruthsOneLie}
                  onChange={(e) =>
                    updateFormData("twoTruthsOneLie", e.target.value)
                  }
                  placeholder="1) I once debugged a smart contract for 12 hours straight and found the bug was a missing semicolon&#10;2) I've never used Stack Overflow&#10;3) I built my first app when I was 14 and it got 10k downloads"
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Users className="text-pink-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Team Vibe</h2>
              </div>
              <p className="text-gray-400">How do you work with others?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  My ideal teammate...
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Tag skills or traits you&apos;d love in a teammate
                </p>
                <input
                  type="text"
                  value={formData.idealTeammate}
                  onChange={(e) =>
                    updateFormData("idealTeammate", e.target.value)
                  }
                  placeholder="Someone who's passionate about clean code, loves brainstorming wild ideas, and isn't afraid to ship fast and break things..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Pair-programming style:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: "silence",
                      label: "🤐 Silence & focus",
                      desc: "Deep work mode",
                    },
                    {
                      id: "banter",
                      label: "🤣 Banter & memes",
                      desc: "Fun while coding",
                    },
                    {
                      id: "teach",
                      label: "🤓 Teach / learn together",
                      desc: "Knowledge sharing",
                    },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() =>
                        updateFormData("pairProgrammingStyle", style.id)
                      }
                      className={`p-4 rounded-xl border transition-all text-center ${
                        formData.pairProgrammingStyle === style.id
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                          : "bg-slate-800/50 border-slate-700 text-gray-400 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="text-lg mb-1">{style.label}</div>
                      <div className="text-xs">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative w-5 h-5">
                    <input
                      type="checkbox"
                      checked={formData.openToSideProjects}
                      onChange={(e) =>
                        updateFormData("openToSideProjects", e.target.checked)
                      }
                      className="peer appearance-none w-5 h-5 border border-slate-600 bg-slate-800 rounded-xs checked:bg-blue-500 transition"
                    />
                    <Check
                      className="absolute top-0 left-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-white font-semibold">
                    Open to side projects?
                  </span>
                </label>
                <p className="text-gray-400 text-sm ml-7">
                  Beyond hackathons, are you interested in building long-term
                  projects together?
                </p>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Sparkles className="text-orange-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Dev Mascot & Avatar
                </h2>
              </div>
              <p className="text-gray-400">Pick your coding spirit animal</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-4">
                  Choose your mascot:
                </label>
                <div className="grid grid-cols-2 md:flex gap-4">
                  {mascotOptions.map((mascot) => (
                    <button
                      key={mascot.id}
                      onClick={() => updateFormData("mascot", mascot.id)}
                      className={`p-6 rounded-xl border transition-all text-center ${
                        formData.mascot === mascot.id
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                          : "bg-slate-800/50 border-slate-700 text-gray-400 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="text-4xl mb-2">{mascot.emoji}</div>
                      <div className="font-semibold mb-1">{mascot.name}</div>
                      <div className="text-xs">{mascot.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  &quot;This mascot shows I&apos;m...&quot;
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  E.g. &quot;always debugging with dragon-like focus.&quot;
                </p>
                <input
                  type="text"
                  value={formData.mascotDescription}
                  onChange={(e) =>
                    updateFormData("mascotDescription", e.target.value)
                  }
                  placeholder="someone who hunts bugs relentlessly and never gives up on solving complex problems..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              {/* 
              <div>
                <label className="block text-white font-semibold mb-2">
                  Avatar Upload (optional)
                </label>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-slate-600 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-400 text-sm">
                    Drop your avatar here or click to upload
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="flex gap-2 justify-center items-center mb-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <MessageSquare className="text-green-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Final Words</h2>
              </div>
              <p className="text-gray-400">
                You&apos;re about to drop your profile on-chain. Say something
                to your future teammates.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Message to future teammates:
                </label>
                <textarea
                  value={formData.finalMessage}
                  onChange={(e) =>
                    updateFormData("finalMessage", e.target.value)
                  }
                  placeholder="Ready to build something amazing together? Let's turn wild ideas into reality, one commit at a time. Hit me up if you're passionate about creating the future! 🚀"
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Profile Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">
                      {formData.name || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skills:</span>
                    <span className="text-white">
                      {formData.languages.length} languages
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domains:</span>
                    <span className="text-white">
                      {formData.domains.length} domains
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hackathons:</span>
                    <span className="text-white">
                      {formData.hackathonsAttended || "0"} attended
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mascot:</span>
                    <span className="text-white">
                      {mascotOptions.find((m) => m.id === formData.mascot)
                        ?.name || "Code Dragon"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.readyToMatch}
                    onChange={(e) =>
                      updateFormData("readyToMatch", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 p-2 rounded-xs"
                  />
                  <span className="text-white font-semibold">
                    I&apos;m ready to get matched & build legendary hacks 🚀
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <Navbar />

      {/* Debug: Show current step for troubleshooting */}
      <div className="text-center text-sm text-gray-300 absolute top-2 left-1/2 mb-2">
        Step {currentStep} of {totalSteps}
      </div>
      {/* Progress Bar */}
      <div className="relative mt-10 py-2 z-50 border-b border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="w-full bg-slate-800/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-5xl flex justify-center py-8 font-black text-gray-400">
        BuddyFi Onboarding...
      </div>

      <main className="relative z-10 container mx-auto px-4 py-4">
        <div className="mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 md:p-12">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-12">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant={"ghost"}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                <ChevronLeft size={20} className="mr-1" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.readyToMatch}
                  variant={"mintButton"}
                >
                  <Wallet size={20} className="mr-2" />
                  Mint Profile & Sign
                </Button>
              ) : (
                <Button onClick={nextStep} variant={"buttons"} className="">
                  Next
                  <ChevronRight size={20} className="ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
