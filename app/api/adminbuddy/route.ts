/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/adminbuddy/route.ts

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_SECRET_API_KEY!;
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS!;

export async function GET(request: Request) {
  // Get wallet address from query parameters
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  console.log('Admin check:', { 
    providedWallet: walletAddress, 
    adminWallet: ADMIN_WALLET_ADDRESS,
    isMatch: walletAddress === ADMIN_WALLET_ADDRESS 
  });

  // Check if the wallet address matches the admin address
  if (!walletAddress || walletAddress !== ADMIN_WALLET_ADDRESS) {
    return new Response(
      JSON.stringify({ error: "Unauthorized access" }),
      { status: 403 }
    );
  }

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
      console.error('Pinata API error:', await response.text());
      return new Response(JSON.stringify({ error: "Failed to fetch pins" }), {
        status: response.status,
      });
    }

    const data = await response.json();
    console.log('Pinata response:', { 
      totalPins: data.rows?.length || 0,
      firstPin: data.rows?.[0]
    });
    
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
            console.error('IPFS fetch error:', { hash: ipfsHash, status: ipfsResponse.status });
            return null;
          }

          const userData = await ipfsResponse.json();
          return {
            pinInfo: pin,
            userData
          };
        } catch (error) {
          console.error('IPFS fetch error:', { hash: ipfsHash, error });
          return null;
        }
      })
    );
  
      // Filter out any failed requests
      const validUsers = usersData.filter(user => user !== null);
      console.log('Processed users:', { 
        total: usersData.length,
        valid: validUsers.length
      });

        // Group users by wallet address and keep only the most recent profile
    const latestProfilesByWallet = validUsers.reduce((acc: { [key: string]: any }, current) => {
      const walletAddress = current.userData.walletAddress;
      if (!walletAddress) return acc;

       // If this wallet hasn't been seen before, or if this profile is more recent
       if (!acc[walletAddress] || 
        new Date(current.pinInfo.date_pinned) > new Date(acc[walletAddress].pinInfo.date_pinned)) {
      acc[walletAddress] = current;
    }
    return acc;
  }, {});

    // Convert the object back to an array
    const uniqueLatestProfiles = Object.values(latestProfilesByWallet);

    console.log('Filtered profiles:', {
      beforeFiltering: validUsers.length,
      afterFiltering: uniqueLatestProfiles.length
    });

      // Return all users data
      return new Response(JSON.stringify({ users: uniqueLatestProfiles }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error('Server error:', error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: error.message,
        }),
        { status: 500 }
      );
    }
  }