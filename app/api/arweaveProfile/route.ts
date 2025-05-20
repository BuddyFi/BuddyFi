/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchArweaveTxId } from '@/services/profile/fetchArweaveTxId';
import { fetchProfileData } from '@/services/profile/fetchProfileData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return new Response(
      JSON.stringify({ error: "Wallet address is required" }),
      { status: 400 }
    );
  }

  try {
    const txId = await fetchArweaveTxId(walletAddress);

    if (!txId) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
    }

    const profileData = await fetchProfileData(txId);

    return new Response(JSON.stringify({ txId, profileData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
}
