import React from "react";
import ConnectWalletButton from "./solana/ConnectWalletButton";
import Link from "next/link";

const Navbar: React.FC = () => (
    <nav className="absolute left-0 w-[98vw] flex justify-between items-center px-4 top-2">
        <Link href="/" className="text-xl font-bold">BuddyFi</Link>
        <ConnectWalletButton/>
    </nav>
)

export default Navbar;