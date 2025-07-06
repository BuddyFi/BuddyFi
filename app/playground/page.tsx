/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Share2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const Page = () => {
  const transactionHash =
  "5Z3MtQnvnuAlqiFkFjVACdix63Hez5ENZ5qujAX3RvXyQGEPST5FNqqWy5mE7UD1M7FRwvFc3xyylfZnHMEuDw6H";
  const ipfsCid = "QmR3koTNFTipMYgjqHnqd3wHa8thKMq7mgxDbaXTp1M";
  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopied(`${type}-error`);
      setTimeout(() => setCopied(null), 2000);
    }
  };
  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${ipfsCid}`;
    const shareData = {
      title: "My BuddyFi Dev Profile",
      text: "Check out my developer profile on BuddyFi! 🚀",
      url: profileUrl,
    };

    // Try native sharing first
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
          // Fallback to copying link
          await copyToClipboard(profileUrl, "share");
        }
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard(profileUrl, "share");
    }
  };

  const downloadCertificate = async () => {
    try {
      // Create a canvas for the certificate
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#1e293b");
      gradient.addColorStop(0.5, "#334155");
      gradient.addColorStop(1, "#0f172a");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add border
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Add title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("BuddyFi Certificate", canvas.width / 2, 120);

      // Add subtitle
      ctx.font = "24px Arial";
      ctx.fillStyle = "#10b981";
      ctx.fillText("Developer Profile Verification", canvas.width / 2, 160);

      // Add main text
      ctx.font = "32px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("This certifies that", canvas.width / 2, 220);

      // Add user name placeholder
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#a855f7";
      ctx.fillText("Developer", canvas.width / 2, 280);

      // Add description
      ctx.font = "20px Arial";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(
        "has successfully created and verified",
        canvas.width / 2,
        320
      );
      ctx.fillText(
        "their developer profile on the blockchain",
        canvas.width / 2,
        350
      );

      // Add transaction info
      ctx.font = "14px monospace";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "left";
      ctx.fillText(
        `Transaction: ${transactionHash.substring(0, 32)}...`,
        60,
        420
      );
      ctx.fillText(`IPFS: ${ipfsCid}`, 60, 445);

      // Add date
      ctx.textAlign = "center";
      ctx.font = "16px Arial";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `Issued on ${new Date().toLocaleDateString()}`,
        canvas.width / 2,
        520
      );

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `buddyfi-certificate-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error generating certificate:", error);
      // Show error feedback to user
      setCopied("certificate-error");
      setTimeout(() => setCopied(null), 3000);
    }
  };
  return (
    <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8 transition-all duration-1000 transform">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-400 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Hello Buddy! 🎉
        </h1>
        <p className="text-xl text-slate-300">
          Your Dev Profile is created and stored on-chain.
        </p>
      </div>{" "}
      <Card className="border-green-500/50 bg-slate-800/50 backdrop-blur-sm transition-all duration-1000 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-green-400">
              Profile Created Successfully!
            </h2>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-300 border-green-500/30"
            >
              Live
            </Badge>
          </div>

          <p className="text-slate-300 mb-8 text-lg">
            Your profile is now live on-chain and stored on IPFS. You can check
            status on the links given below.
          </p>

          {/* Transaction details with copy functionality */}
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Transaction Hash:
              </label>
              <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-lg border border-slate-600 group-hover:border-purple-500/50 transition-colors">
                <code className="flex-1 text-sm text-purple-300 font-mono break-all">
                  {transactionHash}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(transactionHash, "transaction")
                  }
                  className="shrink-0 hover:bg-purple-500/20"
                >
                  {copied === "transaction" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    window.open(
                      `https://explorer.solana.com/tx/${transactionHash}`,
                      "_blank"
                    )
                  }
                  className="shrink-0 hover:bg-blue-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                IPFS CID:
              </label>
              <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-lg border border-slate-600 group-hover:border-blue-500/50 transition-colors">
                <code className="flex-1 text-sm text-blue-300 font-mono break-all">
                  {ipfsCid}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(ipfsCid, "ipfs")}
                  className="shrink-0 hover:bg-blue-500/20"
                >
                  {copied === "ipfs" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    window.open(`https://ipfs.io/ipfs/${ipfsCid}`, "_blank")
                  }
                  className="shrink-0 hover:bg-blue-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 group"
          >
            <Eye className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            View Profile
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={shareProfile}
            className="border-slate-600 hover:border-purple-500 hover:bg-purple-500/10 transform hover:scale-105 transition-all duration-200 group bg-transparent"
          >
            {copied === "share" ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Share Profile
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={downloadCertificate}
            className="border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 transform hover:scale-105 transition-all duration-200 group bg-transparent"
          >
            {copied === "certificate-error" ? (
              <>
                <span className="w-5 h-5 mr-2 text-red-400">✕</span>
                Error
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download Certificate
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="py-8">
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              What&apos;s Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    Connect with Buddies
                  </h4>
                  <p className="text-sm text-slate-400">
                    Start building your developer network
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Explore Projects</h4>
                  <p className="text-sm text-slate-400">
                    Discover exciting collaboration opportunities
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
