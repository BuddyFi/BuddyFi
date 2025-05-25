"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  codeSnippet: string
}

export function FeatureCard({ title, description, icon, color, codeSnippet }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="group relative overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 dark:border-slate-700 dark:bg-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-48 bg-gradient-to-r ${color}`}>
        <div className="flex h-full items-center justify-center">
          <motion.div
            animate={isHovered ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-white"
          >
            {icon}
          </motion.div>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-mono md:text-2xl text-xl text-white">{title}</CardTitle>
        <CardDescription className="text-slate-400 text-sm">Verify your skills with proof of contribution</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 md:text-md text-sm">{description}</p>
      </CardContent>

      {/* Code snippet overlay */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center bg-slate-950/90 p-6 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full">
          <h3 className="mb-2 font-mono text-xl font-bold text-white">{title}</h3>
          <div className="rounded-md bg-slate-900 p-4 shadow-inner shadow-cyan-500/5">
            <pre className="overflow-x-auto font-mono text-xs text-cyan-400">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </div>
      </motion.div>
    </Card>
  )
}
