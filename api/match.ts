/* eslint-disable @typescript-eslint/no-explicit-any */
import { VercelRequest, VercelResponse } from '@vercel/node';

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dot = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  if (norm1 === 0 || norm2 === 0) return 0;
  return dot / (norm1 * norm2);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { vector, others } = req.body;

    if (!vector || !others) {
      return res.status(400).json({ error: "Missing 'vector' or 'others'" });
    }

    const results = others.map((profile: any) => ({
      username: profile.username,
      score: cosineSimilarity(vector, profile.vector)
    }));

    const sorted = results.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
    return res.status(200).json({ matches: sorted });

  } catch (error) {
    console.error("Error in match.ts:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
