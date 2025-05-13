/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/adminbuddy/route.ts

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_SECRET_API_KEY!;

export async function GET() {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    return new Response(
      JSON.stringify({ error: "Pinata API keys are missing" }),
      { status: 400 }
    );
  }

  try {
    // Step 1: Get list of pins from Pinata
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
    
    // Get all pins
    const pins = data.rows || [];
    
    if (pins.length === 0) {
      return new Response(
        JSON.stringify({ users: [] }),
        { status: 200 }
      );
    }

    // Step 2: Fetch content for each pin
    const usersData = await Promise.all(
      pins.map(async (pin: any) => {
        const ipfsHash = pin.ipfs_pin_hash;
        try {
          const ipfsResponse = await fetch(
            `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
          );
          
          if (!ipfsResponse.ok) {
            return null;
          }
          
          const userData = await ipfsResponse.json();
          return {
            pinInfo: pin,
            userData
          };
        } catch {
          // Ignore fetch errors and return null for this user
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validUsers = usersData.filter(user => user !== null);

    // Create a map to store the most recent profile for each wallet address
    const latestProfilesByWallet = new Map();

    // Iterate through all valid users and keep only the most recent profile per wallet
    validUsers.forEach(user => {
      const walletAddress = user.userData.walletAddress?.toLowerCase();
      if (!walletAddress) return; // Skip if no wallet address

      const currentDate = new Date(user.pinInfo.date_pinned).getTime();
      const existingProfile = latestProfilesByWallet.get(walletAddress);

      if (!existingProfile || currentDate > new Date(existingProfile.pinInfo.date_pinned).getTime()) {
        latestProfilesByWallet.set(walletAddress, user);
      }
    });

    // Convert the map values back to an array
    const uniqueLatestProfiles = Array.from(latestProfilesByWallet.values());

    // Return filtered users data
    return new Response(JSON.stringify({ users: uniqueLatestProfiles }), {
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