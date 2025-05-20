"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

interface Subscription {
  planId: string
  planName: string
  startDate: number
  expiryDate: number
  walletAddress: string
}

interface SubscriptionContextType {
  subscription: Subscription | null
  setSubscription: (subscription: Subscription | null) => void
  calculateExpiryDate: (planId: string, startDate: number) => number
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const { publicKey } = useWallet()

  // Load subscription from localStorage on mount
  useEffect(() => {
    if (publicKey) {
      const savedSubscription = localStorage.getItem(`subscription_${publicKey.toBase58()}`)
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription))
      }
    }
  }, [publicKey])

  // Save subscription to localStorage when it changes
  useEffect(() => {
    if (subscription && publicKey) {
      localStorage.setItem(`subscription_${publicKey.toBase58()}`, JSON.stringify(subscription))
    }
  }, [subscription, publicKey])

  const calculateExpiryDate = (planId: string, startDate: number): number => {
    const now = startDate
    switch (planId) {
      case "monthly":
        return now + 30 * 24 * 60 * 60 * 1000 // 30 days
      case "biannual":
        return now + 180 * 24 * 60 * 60 * 1000 // 180 days
      case "yearly":
        return now + 365 * 24 * 60 * 60 * 1000 // 365 days
      default:
        return now
    }
  }

  return (
    <SubscriptionContext.Provider value={{ subscription, setSubscription, calculateExpiryDate }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
} 