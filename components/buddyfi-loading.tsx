"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BuddyfiLoadingProps {
  children: ReactNode;
  isLoading: boolean;
}

export default function BuddyfiLoading({ children, isLoading }: BuddyfiLoadingProps) {
  const LoadingContent = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-buddyfi-background/80 backdrop-blur-sm">
      {/* Loading Animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-purple-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 w-20 h-20 rounded-full border-2 border-blue-400/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Center Pulse */}
        <motion.div
          className="absolute inset-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Orbiting Dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: 360,
              x: 40 * Math.cos((i * 120 * Math.PI) / 180),
              y: 40 * Math.sin((i * 120 * Math.PI) / 180),
            }}
            transition={{
              rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingContent />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
