import { PublicKey } from "@solana/web3.js";

export interface Profile {
    wallet: PublicKey;
    skills: string[];
    hackathon_participations: number;
}