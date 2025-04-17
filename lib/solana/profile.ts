/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { serialize, deserialize } from "borsh";
import { Profile } from "@/types/profile";
import { PROGRAM_ID } from "./constants";

// Borsh schema
class ProfileSchema {
  wallet: Uint8Array;
  skills: string;
  verified: boolean;
  ipfs_cid: string;
  hackathon_participations: number;

  constructor(fields: Profile) {
    this.wallet = fields.wallet.toBytes();
    this.skills = fields.skills.join(",");
    this.verified = fields.verified;
    this.ipfs_cid = fields.ipfs_cid;
    this.hackathon_participations = fields.hackathon_participations;
  }

  static schema = new Map([
    [
      ProfileSchema,
      {
        kind: "struct",
        fields: [
          ["wallet", [32]],
          ["skills", ["string"]],
          ["hackathon_participations", "u32"],
          ["verified", "u8"],
          ["ipfs_cid", "string"],
        ],
      },
    ],
  ]);
}

export const initializeProfile = async (
  connection: Connection,
  publicKey: PublicKey,
  sendTransaction: (
    transaction: Transaction,
    connection: Connection,
    options?: any
  ) => Promise<string>,
  ipfsCid: string = "QmZfixVHJnYYAwfcaqZGgJCfmWGr39p8VLBsgnfYnoZUuf",
  skills: string[] = ["nextjs", "solana"]
): Promise<string> => {
  // Derive the profile PDA
  const [profilePubkey, bump] = await PublicKey.findProgramAddress(
    [Buffer.from("profile"), publicKey.toBuffer()],
    PROGRAM_ID
  );
  console.log(
    "Initializing profile at:",
    profilePubkey.toBase58(),
    "with bump:",
    bump
  );
  console.log("For wallet:", publicKey.toBase58());
  console.log("Using program ID:", PROGRAM_ID.toBase58());
  console.log("IPFS CID:", ipfsCid);
  console.log("Skills:", skills);

  console.log("Derived profile address:", profilePubkey.toString());

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  const space = 1024; // Adjust based on your needs
  const rentExemption = await connection.getMinimumBalanceForRentExemption(
    space
  );
  console.log("Rent exemption:", rentExemption);

  // Create account via the program (not SystemProgram directly)
  const createProfileIx = new TransactionInstruction({
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: true }, // Payer
      { pubkey: profilePubkey, isSigner: false, isWritable: true }, // PDA account
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program for create account
    ],
    programId: PROGRAM_ID,
    data: Buffer.from([0, bump]), // Instruction 0 = create_profile, include bump seed
  });

  // Initialize profile data with the IPFS CID from the form
  const profileData = new ProfileSchema({
    wallet: publicKey,
    skills: skills, // Use skills from form
    verified: false,
    ipfs_cid: ipfsCid, // Use CID from IPFS upload
    hackathon_participations: 0,
  });

  const initializeIx = new TransactionInstruction({
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: true }, // Payer
      { pubkey: profilePubkey, isSigner: false, isWritable: true }, // PDA account
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
    ],
    programId: PROGRAM_ID,
    data: Buffer.concat([
      Buffer.from([1]), // Instruction 1 = initialize_profile
      Buffer.from(serialize(ProfileSchema.schema, profileData)),
    ]),
  });

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: publicKey,
  }).add(createProfileIx, initializeIx);

  try {
    // Use the sendTransaction function from wallet adapter
    const signature = await sendTransaction(transaction, connection);
    console.log("Account created! Signature:", signature);

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction({
      signature,
      lastValidBlockHeight,
      blockhash,
    });

    console.log("Transaction confirmed:", confirmation);

    return signature;
  } catch (error) {
    console.error("Failed to create account:", error);
    throw error;
  }
};

export const fetchProfile = async (
  connection: Connection,
  profilePubkey: PublicKey
): Promise<Profile | null> => {
  try {
    const accountInfo = await connection.getAccountInfo(profilePubkey);
    if (!accountInfo) return null;

    // Add debug log for PDA verification
    console.log("Fetching profile from PDA:", profilePubkey.toString());

    // Deserialize with error handling
    const decoded = deserialize(
      ProfileSchema.schema,
      ProfileSchema,
      accountInfo.data
    ) as ProfileSchema;

    // Convert Set/unsupported types to serializable formats
    return {
      wallet: new PublicKey(decoded.wallet),
      skills: Array.isArray(decoded.skills)
        ? decoded.skills
        : Array.from(decoded.skills),
      // Ensure array conversion
      verified: Boolean(decoded.verified),
      ipfs_cid: decoded.ipfs_cid,
      hackathon_participations: Number(decoded.hackathon_participations),
    };
  } catch (error) {
    console.error("Profile fetch error:", {
      error,
      profilePubkey: profilePubkey.toString(),
      network: connection.rpcEndpoint,
    });
    return null;
  }
};
