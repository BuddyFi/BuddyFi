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
      quarter: "Q1 2025",
      title: "Beta Launch",
      description: "Initial release with core matching features and basic profiles.",
      items: ["Wallet integration", "Basic matching algorithm", "Profile creation"],
      details:
        "Our beta launch will focus on the core functionality of matching developers based on complementary skills and interests. We'll start with Ethereum wallet integration and basic profile creation.",
      icon: <DevIcon.CodeIcon className="h-6 w-6" />,
    },
    {
      quarter: "Q2 2025",
      title: "Hackathon Integration",
      description: "Partner with major hackathon organizers for seamless team formation.",
      items: ["ETHGlobal partnership", "In-app hackathon calendar", "Team registration API"],
      details:
        "We'll integrate directly with major hackathon platforms to streamline the team formation and registration process. This includes an API for hackathon organizers and an in-app calendar of upcoming events.",
      icon: <DevIcon.BracketsIcon className="h-6 w-6" />,
    },
    {
      quarter: "Q3 2025",
      title: "DAO Governance",
      description: "Community-driven development and feature prioritization.",
      items: ["Governance token", "Proposal system", "Community treasury"],
      details:
        "BuddyFi will transition to community governance with the launch of our governance token. Token holders will be able to vote on feature prioritization, partnerships, and treasury allocations.",
      icon: <DevIcon.TerminalIcon className="h-6 w-6" />,
    },
    {
      quarter: "Q4 2026",
      title: "Global Expansion",
      description: "Support for regional hackathons and localized matching.",
      items: ["Multi-language support", "Regional hubs", "Local event integration"],
      details:
        "We'll expand globally with support for regional hackathons, multiple languages, and localized matching algorithms that account for regional tech ecosystems and preferences.",
      icon: <DevIcon.SwipeIcon className="h-6 w-6" />,
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
            <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 text-center shadow-lg shadow-cyan-500/10">
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
