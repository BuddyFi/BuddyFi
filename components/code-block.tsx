"use client"

import { motion } from "framer-motion"

interface CodeBlockProps {
  text: string
  highlight?: boolean
  light?: boolean
}

export function CodeBlock({ text, highlight = false, light = false }: CodeBlockProps) {
  const baseClasses = "inline-block"
  const textClasses = highlight
    ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400"
    : light
      ? "text-white"
      : "text-white"

  return (
    <span className={`${baseClasses} ${textClasses} relative`}>
      {text}
      {highlight && (
        <motion.span
          className="absolute -inset-1 -z-10 block rounded-md bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-sm"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </span>
  )
}
