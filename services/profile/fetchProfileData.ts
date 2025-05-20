import { ProfileData } from './types';

export async function fetchProfileData(txId: string): Promise<ProfileData> {
  const profileRes = await fetch(`https://arweave.net/${txId}`);

  if (!profileRes.ok) throw new Error("Failed to fetch profile data");

  return await profileRes.json();
}
