/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react";

type PinData = {
  ipfs_pin_hash: string;
  size: number;
  user_id: string;
  date_pinned: string;
  mime_type: string;
  number_of_files: number;
};

type IpfsData = {
  // Adjust this type based on the actual data structure from IPFS
  [key: string]: any;
};

export default function DataPage() {
  const [pinData, setPinData] = useState<PinData | null>(null);
  const [ipfsData, setIpfsData] = useState<IpfsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data"); // The API route you created
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        console.log('pinata data', data)
        setPinData(data.pinInfo);
        setIpfsData(data.ipfsData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pinata Data</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Pin Metadata</h2>
        <pre>{JSON.stringify(pinData, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold">IPFS Data</h2>
        <pre>{JSON.stringify(ipfsData, null, 2)}</pre>
      </div>
    </div>
  );
}
