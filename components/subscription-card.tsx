"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { sendPayment } from "@/lib/solana"
import { useToast } from "../hooks/use-toast"

interface SubscriptionProps {
  subscription: {
    id: string
    title: string
    price: number
    period: string
    features: string[]
    popular?: boolean
  }
}

type PaymentStatus = "idle" | "loading" | "success" | "error"

export function SubscriptionCard({ subscription }: SubscriptionProps) {
  const [status, setStatus] = useState<PaymentStatus>("idle")
  const [signature, setSignature] = useState<string | null>(null)
  const walletContext = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()

  const handlePayment = async () => {
    if (!walletContext.connected || !walletContext.publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment",
        variant: "destructive",
      })
      return
    }

    setStatus("loading")

    try {
      // Send payment transaction
      const txSignature = await sendPayment(walletContext, connection, subscription.price)

      setSignature(txSignature)
      setStatus("success")

      toast({
        title: "Payment successful!",
        description: `You have successfully subscribed to the ${subscription.title} plan.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Payment failed:", error)
      setStatus("error")

      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })

      // Reset to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const getButtonText = () => {
    switch (status) {
      case "loading":
        return "Processing..."
      case "success":
        return "Payment Successful!"
      case "error":
        return "Payment Failed"
      default:
        return "Pay with Solana"
    }
  }

  const getButtonClass = () => {
    switch (status) {
      case "success":
        return "bg-green-600 hover:bg-green-700"
      case "error":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600"
    }
  }

  return (
    <Card
      className={`relative flex flex-col border-gray-800 bg-gray-900 ${
        subscription.popular ? "border-purple-500 shadow-lg shadow-purple-500/20" : ""
      }`}
    >
      {subscription.popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-purple-600 to-green-500 px-3 py-1 text-xs font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{subscription.title}</CardTitle>
        <CardDescription className="text-gray-400">
          Perfect for{" "}
          {subscription.period === "month"
            ? "trying out"
            : subscription.period === "6 months"
              ? "committed users"
              : "power users"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">{subscription.price}</span>
          <span className="text-lg text-gray-400"> SOL</span>
          <span className="text-sm text-gray-500 ml-1">/ {subscription.period}</span>
        </div>
        <ul className="space-y-2">
          {subscription.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          onClick={handlePayment}
          disabled={status === "loading" || !walletContext.connected}
          className={`w-full ${getButtonClass()}`}
        >
          {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>

        {!walletContext.connected && <p className="text-xs text-gray-500 text-center">Connect your wallet to subscribe</p>}

        {status === "success" && signature && (
          <div className="text-xs text-gray-400 text-center">
            <p className="mb-1">Transaction Signature:</p>
            <p className="font-mono break-all">
              {signature.slice(0, 20)}...{signature.slice(-20)}
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
