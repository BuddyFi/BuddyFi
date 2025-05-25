/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface UserData {
    userData: {
        walletAddress?: string;
        name?: string;
        avatar?: string;
        skills?: string[];
        timezone?: string;
        bio?: string;
        githubUsername?: string;
        availability?: string;
    };
    pinInfo: {
        ipfs_pin_hash: string;
        date_pinned: string;
    };
}

export default function IsFirstTime(){
    const { publicKey } = useWallet();
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserProfile = async () => {
            if (!publicKey) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                
                const data = await response.json();
                const userProfile = data.users.find(
                    (user: UserData) => user.userData.walletAddress?.toLowerCase() === publicKey.toBase58().toLowerCase()
                );
                
                setIsFirstTime(!userProfile);
            } catch (error) {
                console.error('Error checking user profile:', error);
                setIsFirstTime(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserProfile();
    }, [publicKey]);

    if (isLoading) {
        return null;
    }

    return(
        <>
        <div className="flex justify-center">
            {/* First-time user profile completion */}
            {isFirstTime && (
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Complete Your Profile</CardTitle>
                  <CardDescription>
                    Set up your profile to start connecting with other Web3
                    enthusiasts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Link href="/create">
                    <Button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Complete Profile
                    </Button>
                    </Link>
                    
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
    )
}