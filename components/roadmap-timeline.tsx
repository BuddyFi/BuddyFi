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
    title: "Mobile‑First Experience",
    description: "Polish and optimize BuddyFi’s UI for Android and iOS.",
    items: [
      "Responsive swipe and dashboard layouts",
      "Okto wallet integration for in‑app payments",
      "Mobile performance tuning and testing"
    ],
    details:
      "Deliver a polished, responsive interface on both Android and iOS to boost session times, simplify wallet flows, and improve overall user satisfaction.",
    icon: <DevIcon.DeviceMobileIcon className="h-6 w-6" />,
  },
  {
    quarter: "Q3 2024",
    title: "cNFT Badge Rollout",
    description: "Launch compressed‑NFT badges for key achievements.",
    items: [
      "Mint 5 initial badge types (e.g., First Hackathon, Team MVP)",
      "Store metadata snapshots on Arweave",
      "Integrate badge display in profiles and dashboards"
    ],
    details:
      "Introduce our on‑chain reward system by minting cNFTs for core milestones and embedding them into user profiles and team views to incentivize engagement.",
    icon: <DevIcon.CertificateIcon className="h-6 w-6" />,
  },
  {
    quarter: "Q4 2024",
    title: "Developer Onboarding & Engagement",
    description: "Activate and retain a thriving developer community.",
    items: [
      "Onboard 500+ active developers",
      "Run in‑app tutorials and community workshops",
      "Achieve ≥ 60% 30‑day retention"
    ],
    details:
      "Execute targeted marketing, in‑app guidance, and weekly community events to drive sign‑ups, ensure match-to-dashboard flows, and maintain high retention rates.",
    icon: <DevIcon.ClockIcon className="h-6 w-6" />,
  },
  {
    quarter: "Q5 2024",
    title: "Open Source Toolkit",
    description: "Release BuddyFi’s core codebase and Team Formation SDK.",
    items: [
      "Publish MIT‑licensed GitHub repo",
      "Provide SDKs and API documentation",
      "Host public roadmap and feedback channels"
    ],
    details:
      "Empower hackathon organizers and developers by open‑sourcing our contracts, SDKs, and docs—enabling community contributions and broader ecosystem integration.",
    icon: <DevIcon.TerminalIcon className="h-6 w-6" />,
  },
];



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
