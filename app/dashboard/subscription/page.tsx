"use client"

import { useRouter } from "next/navigation"
import { useSubscription } from "@/context/subscription-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { SolanaProvider } from "@/context/wallet-provider"
import { SubscriptionProvider } from "@/context/subscription-context"

function SubscriptionDashboardContent() {
  const { subscription } = useSubscription()
//   const { publicKey } = useWallet()
  const router = useRouter()

//   useEffect(() => {
//     if (!publicKey) {
//       router.push("/payment")
//     }
//   }, [publicKey, router])

  if (!subscription) {
    return (
      <div className="bg-gray-950 text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You don&apos;t have an active subscription.</p>
              <Button
                onClick={() => router.push("/payment")}
                className="bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600"
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isExpired = subscription.expiryDate < Date.now()

  return (
    <div className="bg-gray-900 h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-[12rem]">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
              <p className="text-gray-400">{subscription.planName}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Wallet Address</h3>
              <p className="text-gray-400 font-mono break-all">
                {subscription.walletAddress}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Subscription Period</h3>
              <p className="text-gray-400">
                Start Date: {formatDate(subscription.startDate)}
              </p>
              <p className="text-gray-400">
                Expiry Date: {formatDate(subscription.expiryDate)}
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <Button
                onClick={() => router.push("/payment")}
                className="bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600"
              >
                {isExpired ? "Renew Plan" : "Upgrade Plan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer/>
    </div>
  )
}

export default function SubscriptionDashboard() {
  return (
    <SolanaProvider>
      <SubscriptionProvider>
        <SubscriptionDashboardContent />
      </SubscriptionProvider>
    </SolanaProvider>
  )
} 