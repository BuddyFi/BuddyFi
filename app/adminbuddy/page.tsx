// app/admin/page.tsx
import { fetchAllProfilesFromArweave } from "@/lib/arweaveUtils";

export default async function AdminPage() {
  const profiles = await fetchAllProfilesFromArweave();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All User Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="p-4 border rounded-xl bg-white/5 border-white/10"
          >
            <h2 className="text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-400">{profile.walletAddress}</p>
            <p className="text-sm text-gray-500">{profile.bio}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {profile.skills.map((s: string) => (
                <span
                  key={s}
                  className="px-2 py-1 text-xs bg-purple-300/20 text-white rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
