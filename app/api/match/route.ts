/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/adminbuddy/route.ts

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_SECRET_API_KEY!;

export async function GET(request: Request) {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    console.error("Pinata API keys are missing");
    return new Response(
      JSON.stringify({ error: "Pinata API keys are missing" }),
      { status: 400 }
    );
  }

  // Get the wallet address from the URL search params
  const { searchParams } = new URL(request.url);
  const userWalletAddress = searchParams.get('walletAddress')?.toLowerCase();

  if (!userWalletAddress) {
    console.error("Wallet address is missing from request");
    return new Response(
      JSON.stringify({ error: "Wallet address is required" }),
      { status: 400 }
    );
  }

  try {
    // Step 1: Get list of pins from Pinata
    console.log("Fetching pins from Pinata...");
    const response = await fetch("https://api.pinata.cloud/data/pinList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch pins",
          details: errorText
        }), 
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Get all pins
    const pins = data.rows || [];
    
    if (pins.length === 0) {
      console.log("No pins found");
      return new Response(
        JSON.stringify({ users: [] }),
        { status: 200 }
      );
    }

    console.log(`Found ${pins.length} pins, fetching content...`);

    // Step 2: Fetch content for each pin
    const usersData = await Promise.all(
      pins.map(async (pin: any) => {
        const ipfsHash = pin.ipfs_pin_hash;
        try {
          const ipfsResponse = await fetch(
            `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
          );
          
          if (!ipfsResponse.ok) {
            console.error(`Failed to fetch IPFS content for hash ${ipfsHash}:`, {
              status: ipfsResponse.status,
              statusText: ipfsResponse.statusText
            });
            return null;
          }
          
          const userData = await ipfsResponse.json();
          return {
            pinInfo: pin,
            userData
          };
        } catch (error) {
          console.error(`Error fetching IPFS content for hash ${ipfsHash}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validUsers = usersData.filter(user => user !== null);
    console.log(`Successfully fetched ${validUsers.length} valid user profiles`);

    // Create a map to store the most recent profile for each wallet address
    const latestProfilesByWallet = new Map();

    // Iterate through all valid users and keep only the most recent profile per wallet
    validUsers.forEach(user => {
      const walletAddress = user.userData.walletAddress?.toLowerCase();
      if (!walletAddress) {
        console.warn("Found user profile without wallet address");
        return;
      }

      const currentDate = new Date(user.pinInfo.date_pinned).getTime();
      const existingProfile = latestProfilesByWallet.get(walletAddress);

      if (!existingProfile || currentDate > new Date(existingProfile.pinInfo.date_pinned).getTime()) {
        latestProfilesByWallet.set(walletAddress, user);
      }
    });

    // Convert the map values back to an array
    const uniqueLatestProfiles = Array.from(latestProfilesByWallet.values());

    // Filter out the user's own profile
    const filteredProfiles = uniqueLatestProfiles.filter(
      profile => profile.userData.walletAddress?.toLowerCase() !== userWalletAddress
    );

    console.log(`Returning ${filteredProfiles.length} filtered profiles`);

    // Return filtered users data
    return new Response(JSON.stringify({ users: filteredProfiles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error in match route:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500 }
    );
  }
}