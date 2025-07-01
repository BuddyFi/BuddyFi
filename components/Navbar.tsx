/* eslint-disable @next/next/no-img-element */
import React from "react";
import ConnectWalletButton from "./solana/ConnectWalletButton";
import Link from "next/link";

const Navbar: React.FC = () => (
  <nav className="absolute left-0 w-[98vw] flex justify-between items-center md:px-4 px-1 top-2">
    <Link href="/">
      <div className="flex gap-1 items-center">
        <img
          src="./BuddyFi_logo.svg"
          alt="BuddyFi logo"
          className="md:h-12 md:w-12 h-10 w-10"
        />
        <p className="md:text-2xl text-xl font-bold">BuddyFi</p>
      </div>
    </Link>
    <ConnectWalletButton />
  </nav>
);

export default Navbar;
