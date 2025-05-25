"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DevIcon } from "./dev-icon"

interface RoadmapTimelineProps {
  inView: boolean
}

export function RoadmapTimeline({ inView }: RoadmapTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
const roadmap = [
  {
    quarter: "Q2 2024",
    title: "Devnet MVP Launch",
    description: "Core matching and team dashboard built on Solana Devnet.",
    items: [
      "Solana wallet integration",
      "Decentralized profile creation (IPFS + on-chain hash)",
      "Swipe-to-match interface",
      "Live team dashboard & task management",
      "Devnet-based subscription payments"
    ],
    details:
      "We launched the MVP of BuddyFi on Solana devnet with fully functional profiles, matchmaking, and a collaborative dashboard. This validated the product direction and technical feasibility.",
    icon: <DevIcon.BracketsIcon className="h-6 w-6" />,
  },
  {
    quarter: "Q3 2024",
    title: "Mainnet Launch + Badge System",
    description: "Move to Solana mainnet and introduce engagement cNFT badges.",
    items: [
      "Mainnet deployment",
      "Subscription payments on Solana mainnet",
      "cNFT badge minting for hackathon milestones",
      "Improved mobile experience",
      "Public launch campaign"
    ],
    details:
      "We’ll go live on mainnet with a polished product, launch our badge system using compressed NFTs, and begin onboarding users via hackathon partnerships and Solana-native onboarding campaigns.",
    icon: <DevIcon.BracketsIcon className="h-6 w-6" />,
  },
  {
    quarter: "Q4 2024",
    title: "Hackathon Partnerships & Growth",
    description: "Partner with Indian hackathons and scale community onboarding.",
    items: [
      "Hackathon organizer dashboard",
      "In-app event calendar",
      "Partnered onboarding with universities",
      "Ambassador & referral system"
    ],
    details:
      "We’ll scale growth by working directly with hackathon organizers and campuses to onboard builders in India, with localized outreach and event-driven growth.",
    icon: <DevIcon.BracketsIcon className="h-6 w-6" />,
  },
  {
    quarter: "Q1 2025",
    title: "Open Source & Developer Ecosystem Tools",
    description: "Open source BuddyFi and release a dev toolkit for on-chain team creation.",
    items: [
      "MIT open-source release",
      "Team formation SDK",
      "Integration docs for hackathons",
      "Public roadmap & community feedback"
    ],
    details:
      "We’ll open source the codebase and empower other builders and event organizers to use BuddyFi’s APIs and SDKs for seamless on-chain team formation on Solana.",
    icon: <DevIcon.TerminalIcon className="h-6 w-6" />,
  },
]


  return (
    <div className="relative mt-20">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute left-0 right-0 top-8 h-1 origin-left bg-gradient-to-r from-cyan-500/30 to-violet-500/30"
      ></motion.div>

      <div className="grid gap-8 md:grid-cols-4">
        {roadmap.map((milestone, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            className="relative pt-16"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          >
            <div className="absolute left-1/2 top-6 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 text-center shadow-lg shadow-cyan-500/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white">
                {milestone.icon}
              </div>
            </div>
            <div className="group relative rounded-lg border-2 border-slate-800 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10">
              <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-cyan-950 to-violet-950 px-3 py-1 text-xs font-medium text-cyan-400">
                {milestone.quarter}
              </div>
              <h3 className="mb-2 font-mono text-xl font-semibold text-white">{milestone.title}</h3>
              <p className="mb-4 text-sm text-slate-400">{milestone.description}</p>
              <ul className="space-y-1 text-sm">
                {milestone.items.map((item, j) => (
                  <li key={j} className="flex items-center">
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"></span>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>

             
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
