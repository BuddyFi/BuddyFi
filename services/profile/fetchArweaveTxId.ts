export async function fetchArweaveTxId(walletAddress: string): Promise<string | null> {
  const query = {
    query: `
      query {
        transactions(
          tags: [
            { name: "walletAddress", values: ["${walletAddress}"] }
          ],
          first: 1
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  };

  const res = await fetch('https://arweave.net/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!res.ok) throw new Error("Failed to query Arweave");

  const data = await res.json();

  const edges = data?.data?.transactions?.edges;
  if (!edges || edges.length === 0) return null;

  return edges[0].node.id;
}