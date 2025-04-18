import React from "react";
import ConnectWalletButton from "./solana/ConnectWalletButton";

const Navbar: React.FC = () => (
    <nav className="absolute left-0 w-[98vw] flex justify-between items-center px-4 top-2">
        <div className="text-xl font-bold">BuddyFi</div>
        <ConnectWalletButton/>
    </nav>
)

export default Navbar;