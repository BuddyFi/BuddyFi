import { NextRequest, NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

export async function POST(req: NextRequest) {
    try {
        const profileData = await req.json()

        const result = await pinata.pinJSONToIPFS(profileData, {
            pinataMetadata: { name: "buddyfi-profile" }
        })

        return NextResponse.json({ cid: result.IpfsHash })
    } catch (err) {
        console.error("IPFS upload error:", err)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}