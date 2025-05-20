import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SubscriptionCard } from "@/components/subscription-card";
import { SolanaProvider } from "@/context/wallet-provider";
import { Toaster } from "@/components/ui/toaster";

export default function PaymentGateway() {
  const subscriptions = [
    {
      id: "monthly",
      title: "Monthly",
      price: 0.2,
      period: "month",
      features: [
        "Basic access to platform",
        "Up to 100 transactions",
        "Email support",
        "Regular updates",
      ],
    },
    {
      id: "biannual",
      title: "6 Months",
      price: 1,
      period: "6 months",
      features: [
        "Full access to platform",
        "Up to 1,000 transactions",
        "Priority email support",
        "Regular updates",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      id: "yearly",
      title: "Yearly",
      price: 1.5,
      period: "year",
      features: [
        "Unlimited access to platform",
        "Unlimited transactions",
        "24/7 priority support",
        "Early access to new features",
        "Advanced analytics",
        "Custom integrations",
      ],
    },
  ];

  return (
    <SolanaProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />

        <main className="container mx-auto px-4 py-20">
          <div className="text-center my-14">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the perfect subscription package for your needs and pay
              seamlessly with Solana. Enjoy lightning-fast transactions and low
              fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
      <Toaster />
    </SolanaProvider>
  );
}
