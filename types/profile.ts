import { PublicKey } from "@solana/web3.js";

export interface Profile {
    wallet: PublicKey;
    skills: string[];
    verified: boolean;
    ipfs_cid: string;
    hackathon_participations: number;
  }
  