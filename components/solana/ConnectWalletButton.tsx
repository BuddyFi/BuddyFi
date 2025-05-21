/* eslint-disable @next/next/no-img-element */
"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"

// Dynamically import WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
)

function shortenAddress(address: string, chars = 4): string {
    if(!address) return "";
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export default function ConnectWalletButton() {
    const { connected, publicKey, wallet, disconnect } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    // Handle mounting state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleViewProfile = () => {
        router.push("/profile")
        setShowDropdown(false);
    };
    const handleBrowseProfile = () => {
        router.push("/discover")
        setShowDropdown(false);
    };
    const handleViewMatches = () => {
        router.push("/matches")
        setShowDropdown(false);
    };
    const handleViewMessages = () => {
        router.push("/workspace")
        setShowDropdown(false);
    };

    const handleDisconnect = () => {
        disconnect();
        setShowDropdown(false);
    };
    
    // Don't render anything until mounted
    if (!mounted) {
        return null;
    }
    
    // If not connected, keep the original WalletMultiButton
    if (!connected) {
        return <WalletMultiButton />
    }
    
    // When connected, show custom styled button with dropdown
    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                className="inline-flex items-center bg-[#7C3AED] hover:bg-gray-800 duration-200 text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {/* Use wallet icon if available */}
                {wallet?.adapter.icon && (
                    <img 
                        src={wallet.adapter.icon}
                        alt={`${wallet.adapter.name} icon`}
                        className="w-5 h-5 mr-2"
                    />
                )}
                {shortenAddress(publicKey?.toBase58() || "")}
            </div>
            
            {/* Dropdown menu */}
            {showDropdown && (
                <div className="absolute mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 right-0">
                    <ul className="py-1">
                        <li 
                            className="px-4 py-2 text-sm text-gray-100 hover:text-gray-400 duration-200 cursor-pointer"
                            onClick={handleViewProfile}
                        >
                            View Profile
                        </li>
                        <li 
                            className="px-4 py-2 text-sm text-gray-100 hover:text-gray-400 duration-200 cursor-pointer"
                            onClick={handleBrowseProfile}
                        >
                            Browse Profiles
                        </li>
                        <li 
                            className="px-4 py-2 text-sm text-gray-100 hover:text-gray-400 duration-200 cursor-pointer"
                            onClick={handleViewMatches}
                        >
                            View Matches
                        </li>
                        <li 
                            className="px-4 py-2 text-sm text-gray-100 hover:text-gray-400 duration-200 cursor-pointer"
                            onClick={handleViewMessages}
                        >
                            View Team Dashboard
                        </li>
                        
                        <li 
                            className="px-4 py-2 text-sm text-gray-100 hover:text-gray-400 duration-200 cursor-pointer"
                            onClick={handleDisconnect}
                        >
                            Disconnect
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}