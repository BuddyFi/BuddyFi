// lib/ipfs.ts

// Function to fetch data from IPFS via Pinata gateway
export async function fetchFromIPFS(cid: string) {
  try {
    // Construct URL with Pinata gateway
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    console.log('Fetching from IPFS URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.status} ${response.statusText}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
}

// Alternative function that supports multiple IPFS gateways with fallback
export async function fetchFromIPFSWithFallback(cid: string) {
  // List of IPFS gateways to try
  const gateways = [
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://dweb.link/ipfs/${cid}`
  ];
  
  let lastError;
  
  // Try each gateway until one works
  for (const gateway of gateways) {
    try {
      console.log('Trying IPFS gateway:', gateway);
      const response = await fetch(gateway);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error);
      lastError = error;
    }
  }
  
  // If we get here, all gateways failed
  throw lastError || new Error('Failed to fetch from all IPFS gateways');
}