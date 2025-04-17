/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/data/route.ts

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
    console.log("received data from pinata", data);

    const pin = data.rows?.[0];

    if (!pin) {
      return new Response(
        JSON.stringify({ error: "No pin found for given hash" }),
        { status: 404 }
      );
    }

    const ipfsHash = pin.ipfs_pin_hash;

    // Step 2: Fetch content from IPFS gateway
    const ipfsResponse = await fetch(
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    );
    if (!ipfsResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch data from IPFS gateway" }),
        { status: ipfsResponse.status }
      );
    }

    const ipfsData = await ipfsResponse.json();

    // Return the actual IPFS content
    return new Response(JSON.stringify({ pinInfo: pin, ipfsData }), {
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
