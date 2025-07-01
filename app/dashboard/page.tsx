/* eslint-disable @next/next/no-img-element */
// app/dashboard/page.tsx
import dynamic from "next/dynamic";
const RepoList = dynamic(() => import("./RepoList"), { ssr: true });

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import GithubContributions from "../../components/GithubContributions";

export default async function DashboardPage() {
  try {
    const githubCookie = (await cookies()).get("githubUser");

    if (!githubCookie || !githubCookie.value) {
      redirect("/login");
    }

    const user = JSON.parse(githubCookie.value);
    const reposRes = await fetch(
      `https://api.github.com/users/${user.login}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const repos = await reposRes.json();

    return (
      <div>
        {/* Navigation */}
        <nav className="shadow border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold">
                    BuddyFi
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative flex items-center space-x-4">
                  <div className="flex gap-2">
                    <Link
                      href="/profile"
                      rel="noreferrer"
                      className="bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700 transition-colors"
                    >
                      View BuddyFi Profile
                    </Link>
                    <Link
                      href="/api/logout"
                      className="bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile Header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center text-center">
            {/* Circular profile picture */}
            <div className="relative h-32 w-32 mb-4">
              <div className="rounded-full overflow-hidden border-2 border-gray-700 h-full w-full">
                {user.avatar_url && (
                  <img
                    className="h-full w-full object-cover"
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                  />
                )}
              </div>
            </div>

            {/* Name/Username */}
            <h1 className="text-2xl font-bold mb-1">
              {user.name || user.login}
            </h1>
            <p className="text-gray-400 mb-2">
              {user.login} · {user.pronouns || "he/him"}
            </p>

            {/* Bio */}
            <p className="text-gray-300 mb-4">
              {user.bio || "Web Developer | Learning Web3!"}
            </p>

            {/* Stats */}
            <div className="flex space-x-6 mb-2 text-sm">
              <div className="flex items-center border px-4 py-1 border-gray-600 rounded-full">
                <span className="font-medium mr-1">
                  {user.followers || "9"}
                </span>{" "}
                followers
              </div>
              <div className="flex items-center border px-4 py-1 border-gray-600 rounded-full">
                <span className="font-medium mr-1">
                  {user.following || "18"}
                </span>{" "}
                following
              </div>
            </div>

            {/* Location and links */}
            <div className="flex flex-col space-y-2 items-center text-sm text-gray-400 mb-8">
              {user.location && (
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {user.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Activity */}
        <div>
          <GithubContributions username={user.login} />
        </div>

        {/* Repository List */}
        <div>
          <RepoList repos={repos} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error parsing GitHub user data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-md">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-400">Error</h3>
            <p className="mt-1 text-sm text-gray-400">
              There was an error loading your profile data.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
