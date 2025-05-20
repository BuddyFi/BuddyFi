/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/arweaveUtils.ts
export async function fetchAllProfilesFromArweave() {
  const query = {
    query: `
      query {
        transactions(
          tags: [
            { name: "App", values: ["BuddyFi"] },
            { name: "Type", values: ["UserProfile"] }
          ],
          first: 100
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
  };

  const res = await fetch("https://arweave.net/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const json = await res.json();
  const transactions = json.data.transactions.edges;

  const profiles = await Promise.all(
    transactions.map(async ({ node }: any) => {
      const res = await fetch(`https://arweave.net/${node.id}`);
      return await res.json();
    })
  );

  return profiles;
}
