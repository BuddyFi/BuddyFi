/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/data/route.ts

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_SECRET_API_KEY!;

export async function GET(request: Request) {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    return new Response(
      JSON.stringify({ error: "Pinata API keys are missing" }),
      { status: 400 }
    );
  }

  // Get wallet address from query parameters
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return new Response(
      JSON.stringify({ error: "Wallet address is required" }),
      { status: 400 }
    );
  }

  try {
    // Step 1: Get list of pins
    const response = await fetch("https://api.pinata.cloud/data/pinList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch pins" }), {
        status: response.status,
      });
    }

    const data = await response.json();
    const pins = data.rows || [];

    // Step 2: Find the pin that matches the wallet address
    let matchingPin = null;
    let matchingProfile = null;

    for (const pin of pins) {
      const ipfsHash = pin.ipfs_pin_hash;
      const ipfsResponse = await fetch(
        `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      );
      
      if (ipfsResponse.ok) {
        const profileData = await ipfsResponse.json();
        if (profileData.walletAddress === walletAddress) {
          matchingPin = pin;
          matchingProfile = profileData;
          break;
        }
      }
    }

    if (!matchingProfile) {
      return new Response(
        JSON.stringify({ error: "No profile found for the given wallet address" }),
        { status: 404 }
      );
    }

    // Return the matching profile data
    return new Response(JSON.stringify({ 
      pinInfo: matchingPin, 
      profileData: matchingProfile 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
