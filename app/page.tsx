/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CodeBlock } from "@/components/code-block";
import { FeatureCard } from "@/components/feature-card";
import { Code } from "lucide-react";
import { DevIcon } from "@/components/dev-icon";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// import { Button } from "@/components/ui/button";

export default function Home() {
  const { publicKey } = useWallet();
  const problemRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const problemInView = useInView(problemRef, { once: true, amount: 0.2 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 });
  const roadmapInView = useInView(roadmapRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicKey) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/data?walletAddress=${publicKey.toString()}`);
        if (response.ok) {
          const data = await response.json();
          // If we have profile data, user is not first time
          setIsFirstTime(false);
        } else {
          // If no profile found, user is first time
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsFirstTime(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [publicKey]);

  // Problem cards data
  const problemCards = [
    {
      title: "Last-minute scrambling",
      description:
        "Frantically DMing strangers on Discord the night before submissions open.",
      icon: "🏃‍♂️",
    },
    {
      title: "Skill mismatches",
      description:
        "I thought you knew Solidity? | I thought YOU knew Solidity!",
      icon: "🤔",
    },
    {
      title: "Trust issues",
      description:
        'Can you really trust someone who claims to be a "10x dev" with a Metamask PFP?',
      icon: "🔍",
    },
    {
      title: "Weekend warriors",
      description:
        "I'm free for 2 hours Sunday night — unless my cat gets sick.",
      icon: "📅",
    },
    {
      title: "Hero syndrome",
      description:
        "One teammate tries to solo the project while everyone else turns into spectators.",
      icon: "🦸‍♂️",
    },
    {
      title: "Timezone black hole",
      description:
        "When your standup turns into a ghost town because it's 4AM for half the team.",
      icon: "🕳️",
    },
  ];

  // Features data
  const features = [
    {
      title: "On-chain Profiles",
      description:
        "Your GitHub commits, StackOverflow answers, and previous hackathon projects are verified and stored on-chain, creating a trustless resume that speaks for itself.",
      icon: <Code className="h-10 w-10" />,
      color: "from-cyan-500 to-cyan-400",
      codeSnippet: `// Verify developer profile
const profile = await buddyfi.verify({
  github: "username",
  ethereum: "0x...",
  skills: ["solidity", "react"]
});`,
    },
    {
      title: "Swipe to Match",
      description:
        "Our algorithm suggests potential teammates based on complementary skills, shared interests, and compatible working styles. Swipe right on developers you'd like to work with.",
      icon: <DevIcon.SwipeIcon className="h-10 w-10" />,
      color: "from-violet-500 to-violet-400",
      codeSnippet: `// Match algorithm
const matches = await buddyfi.findMatches({
  skills: ["needed"],
  interests: ["defi", "gaming"],
  availability: "weekends"
});`,
    },
    {
      title: "Wallet Trust",
      description:
        "We analyze on-chain activity to establish a trust score. Developers with a history of completed projects and active participation are ranked higher in search results.",
      icon: <DevIcon.WalletIcon className="h-10 w-10" />,
      color: "from-cyan-500 to-violet-400",
      codeSnippet: `// Calculate trust score
const trustScore = await buddyfi.calculateTrust({
  address: "0x...",
  history: true,
  contributions: true
});`,
    },
    {
      title: "Team Dashboard",
      description:
        "Once matched, teams get a shared workspace with integrated tools for planning, coding, and submitting projects. Track progress, assign tasks, and collaborate seamlessly.",
      icon: <DevIcon.DashboardIcon className="h-10 w-10" />,
      color: "from-violet-500 to-cyan-400",
      codeSnippet: `// Create team workspace
const workspace = await buddyfi.createTeam({
  name: "EthWizards",
  members: ["0x...", "0x..."],
  hackathon: "ETHGlobal Paris"
});`,
    },
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description:
        "Link your wallet to create your BuddyFi profile. We'll analyze your on-chain activity to establish your developer identity.",
      image: "/connect_wallet.jpg",
      codeSnippet: `// Connect wallet
  const account = await buddyfi.connect();
  console.log("Connected:", account);`,
    },
    {
      number: "02",
      title: "Create Profile",
      description:
        "Add your skills, interests, and preferences. Link your GitHub, showcase past projects, and set your availability for upcoming hackathons.",
      image: "/create_profile.jpg",
      codeSnippet: `// Create profile
  await buddyfi.createProfile({
    name: "DevName",
    skills: ["react", "solidity"],
    github: "username",
    availability: ["weekends", "evenings"]
  });`,
    },
    {
      number: "03",
      title: "Swipe & Match",
      description:
        "Browse potential teammates, swipe right on those you'd like to work with, and start chatting when you match. Form your dream team and get hacking!",
      image: "/matched.webp",
      codeSnippet: `// Find and match with teammates
  const potentialTeammates = await buddyfi.browse();
  for (const dev of potentialTeammates) {
    if (dev.skills.includes("needed-skill")) {
      await buddyfi.swipeRight(dev.id);
    }
  }`,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Pegasus'X",
      role: "On-Chain SPEAKER",
      image: "/placeholder.svg?height=100&width=100&text=AC",
      quote:
        "Omg damn.. This is gonna be explosive 🔥🔥 Super Bullish on this King",
    },
    {
      name: "Sahil Meena",
      role: "Blockchain Dev",
      image: "/placeholder.svg?height=100&width=100&text=SW",
      quote:
        "Guys if you're still looking out for a team for the Breakout Hackathon or just any other hackathon. THIS IS YOUR GO TO PLACE!!!",
    },
    {
      name: "Marcus Johnson",
      role: "Smart Contract Auditor",
      image: "/placeholder.svg?height=100&width=100&text=MJ",
      quote:
        "Found a team that perfectly complemented my security expertise with UI/UX talent. We've now worked on three hackathons together and launched a startup.",
    },
    {
      name: "Priya Sharma",
      role: "Full Stack Developer",
      image: "/placeholder.svg?height=100&width=100&text=PS",
      quote:
        "As someone who's always struggled to find the right teammates, BuddyFi has been revolutionary. The skill-matching algorithm is surprisingly accurate!",
    },
    {
      name: "David Kim",
      role: "Blockchain Architect",
      image: "/placeholder.svg?height=100&width=100&text=DK",
      quote:
        "The on-chain verification of skills is brilliant. No more exaggerated resumes or misleading profiles. What you see is what you get.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />

      {/* hero section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-30 pb-16 text-center">
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
          <p className="mt-6 text-xl text-gray-300 max-w-4xl mx-auto">
            BuddyFi matches developers with the perfect teammates for
            hackathons, using on-chain profiles, skill matching, and a familiar
            swipe-to-connect interface.
          </p>
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-10 flex md:flex-row flex-col gap-2 items-center justify-center"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-800"
                  >
                    <Image
                      src={`/placeholder${i}.jpeg`}
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-slate-400">
                Trusted by{" "}
                <span className="font-semibold text-cyan-400">100+</span> active
                Solana developers this month — and growing.
              </p>
            </motion.div>
          </div>
        </div>

        {!publicKey ? (
          <div>
            {/* Problem Section */}
            <section ref={problemRef} className="px-4 py-24 md:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={problemInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-12 text-center"
                >
                  <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    The <CodeBlock text="hackathon" highlight /> dilemma
                  </h2>
                  <p className="mt-4 text-xl text-slate-300">
                    We&apos;ve all been there. The excitement of a new
                    hackathon, followed by...
                  </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {problemCards.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={problemInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10"
                    >
                      <div className="mb-4 text-3xl">{item.icon}</div>
                      <h3 className="mb-2 font-mono text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-slate-400">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Feature Cards Section */}
            <section ref={featuresRef} className="px-4 py-24 md:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-12 text-center"
                >
                  <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    How BuddyFi <CodeBlock text="rewrites" highlight /> the
                    story
                  </h2>
                  <p className="mt-4 text-xl text-slate-300">
                    We&apos;re bringing Web3 principles to hackathon team
                    formation
                  </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <FeatureCard
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                        color={feature.color}
                        codeSnippet={feature.codeSnippet}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section
              ref={howItWorksRef}
              className=" px-4 py-24 md:px-6 lg:px-8"
            >
              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-16 text-center"
                >
                  <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    <CodeBlock text="Three simple steps" />
                  </h2>
                  <p className="mt-4 text-xl text-slate-300">
                    From solo coder to dream team in minutes
                  </p>
                </motion.div>

                <div className="relative">
                  <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-500/30 to-violet-500/30 md:block"></div>

                  <div className="grid gap-12">
                    {steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.2 }}
                        className="relative grid items-center gap-8 md:grid-cols-2"
                      >
                        <div
                          className={`order-2 ${
                            i % 2 === 1 ? "md:order-1" : "md:order-2"
                          }`}
                        >
                          <div className="group relative md:h-[500px]  w-full mb-10 overflow-hidden rounded-lg border-8 border-slate-800 bg-slate-900 shadow-xl shadow-cyan-500/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10">
                            <Image
                              src={step.image || "/placeholder.svg"}
                              alt={step.title}
                              width={400}
                              height={500}
                              className="w-full transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <div className="w-full max-w-[80%] rounded-lg bg-slate-950/90 p-4">
                                <pre className="overflow-x-auto font-mono text-xs text-cyan-400">
                                  <code>{step.codeSnippet}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`order-1 ${
                            i % 2 === 1 ? "md:order-2" : "md:order-1"
                          }`}
                        >
                          <div className="relative">
                            <div className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white md:left-0 md:translate-x-0">
                              <span className="font-mono font-bold">
                                {step.number}
                              </span>
                            </div>
                            <h3 className="mb-4 font-mono text-2xl font-bold text-white">
                              {step.title}
                            </h3>
                            <p className="text-slate-300">{step.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap Timeline */}
            <section ref={roadmapRef} className="px-4 py-24 md:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-12 text-center"
                >
                  <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    The journey <CodeBlock text="ahead" highlight />
                  </h2>
                  <p className="mt-4 text-xl text-slate-300">
                    Our vision for the future of BuddyFi
                  </p>
                </motion.div>

                <RoadmapTimeline inView={roadmapInView} />
              </div>
            </section>

            {/* Testimonials Carousel */}
            <section
              ref={testimonialsRef}
              className="px-4 py-24 md:px-6 lg:px-8"
            >
              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-12 text-center"
                >
                  <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    <CodeBlock text="Success stories" />
                  </h2>
                  <p className="mt-4 text-xl text-slate-300">
                    Hear from developers who found their dream teams
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={testimonialsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <TestimonialCarousel testimonials={testimonials} />
                </motion.div>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex justify-center">
            {/* First-time user profile completion */}
            {isLoading ? (
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Loading Profile...</CardTitle>
                  <CardDescription>
                    Please wait while we fetch your profile information
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : isFirstTime && (
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Manage Your Profile</CardTitle>
                  <CardDescription>
                    Set up your profile to start connecting with other Web3
                    enthusiasts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Link
                      href="/create"
                      className="flex items-center justify-center px-4 py-2 border rounded-lg bg-neutral-100 text-black font-medium text-sm"
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
                      Manage Profile
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <section className="py-16 container px-4 mx-auto">
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
                        href={isFirstTime ? "/create" : "/profile"}
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
                        {isFirstTime ? "Create Your Decentralized Profile" : "Manage Profile"}
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
