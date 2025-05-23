/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET() {
  const query = {
    query: `
      query {
        transactions(
          tags: [{ name: "app", values: ["buddyfi"] }],
          first: 50,
          sort: HEIGHT_DESC
        ) {
          edges {
            node {
              id
              block {
                timestamp
              }
            }
          }
        }
      }
    `
  };

  const res = await fetch("https://arweave.net/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const data = await res.json();
  const edges = data?.data?.transactions?.edges || [];

  const profiles = await Promise.all(
    edges.map(async ({ node }: any) => {
      const resp = await fetch(`https://arweave.net/${node.id}`);
      if (!resp.ok) return null;
      const json = await resp.json();
      return { ...json, txId: node.id, timestamp: node.block?.timestamp };
    })
  );

  const filtered = profiles.filter(Boolean);

  return new Response(JSON.stringify({ profiles: filtered }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} 