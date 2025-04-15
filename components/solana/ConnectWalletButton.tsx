"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

function shortenAddress(address: string, chars = 4): string {
    if(!address) return "";
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export default function ConnectWalletButton(){
    const { connected, publicKey } = useWallet();

    return (
        <div>
            {!connected ? (
                <WalletMultiButton/>
            ): (
                <p> <span className="font-semibold">Solana:</span> {shortenAddress(publicKey?.toBase58() || "")}</p>
            
            )}
        </div>
    )
}