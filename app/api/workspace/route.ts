/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/adminbuddy/route.ts

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_SECRET_API_KEY!;

// Helper function to recursively convert Sets to Arrays and ensure serializable data
function sanitizeDataForSerialization(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Set) {
    return Array.from(obj);
  }
  
  if (obj instanceof Map) {
    return Object.fromEntries(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeDataForSerialization(item));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeDataForSerialization(value);
    }
    return sanitized;
  }
  
  // For primitive types and functions, return as-is
  // Functions will be stripped out during JSON serialization anyway
  return obj;
}

export async function GET(request: Request) {
  // Get wallet address from query parameters
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

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
          
          // Thoroughly sanitize the entire userData object to ensure all Sets/Maps are converted
          const sanitizedUserData = sanitizeDataForSerialization(userData);
          
          return {
            pinInfo: sanitizeDataForSerialization(pin),
            userData: sanitizedUserData
          };
        } catch (error) {
          console.error('IPFS fetch error:', { hash: ipfsHash, error });
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validUsers = usersData.filter(user => user !== null);

    // Group users by wallet address and keep only the most recent profile
    const latestProfilesByWallet = validUsers.reduce((acc: { [key: string]: any }, current) => {
      const walletAddress = current.userData.walletAddress;
      if (!walletAddress) return acc;

      // Skip if the wallet address matches the requesting user's wallet
      if (walletAddress === searchParams.get('walletAddress')) return acc;

      // If this wallet hasn't been seen before, or if this profile is more recent
      if (!acc[walletAddress] || 
          new Date(current.pinInfo.date_pinned) > new Date(acc[walletAddress].pinInfo.date_pinned)) {
        acc[walletAddress] = current;
      }
      return acc;
    }, {});

    // Convert the object back to an array
    const uniqueLatestProfiles = Object.values(latestProfilesByWallet);

    // Filter out the user with matching wallet address if provided
    const filteredProfiles = walletAddress 
      ? uniqueLatestProfiles.filter((profile: any) => profile.userData.walletAddress !== walletAddress)
      : uniqueLatestProfiles;

    // Sort by most recent pinned date
    filteredProfiles.sort((a: any, b: any) =>
      new Date(b.pinInfo.date_pinned).getTime() - new Date(a.pinInfo.date_pinned).getTime()
    );

    // Get only the 3 most recent users
    const recentUsers = filteredProfiles.slice(0, 3);

    // Final sanitization before returning to ensure everything is serializable
    const sanitizedResponse = sanitizeDataForSerialization({ users: recentUsers });

    // Return recent users
    return new Response(JSON.stringify(sanitizedResponse), {
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