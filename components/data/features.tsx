import { Code } from "lucide-react";
import { DevIcon } from "@/components/dev-icon";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CodeBlock } from "../code-block";
import { FeatureCard } from "../feature-card";

// Features data
const features = [
  {
    title: "On-chain Profiles",
    description:
      "Your GitHub commits, and previous hackathon projects are verified and stored on-chain, creating a trustless resume that speaks for itself.",
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

export default function Features() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  return (
    <>
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
              How BuddyFi <CodeBlock text="rewrites" highlight /> the story
            </h2>
            <p className="mt-4 md:text-xl text-slate-300">
              We&apos;re bringing Web3 principles to hackathon team formation
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
    </>
  );
}
