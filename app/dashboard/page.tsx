/* eslint-disable @next/next/no-img-element */
// app/dashboard/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    const githubCookie = (await cookies()).get("githubUser");
    
    if (!githubCookie || !githubCookie.value) {
      redirect('/login');
    }
    
    const user = JSON.parse(githubCookie.value);
    
    return (
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="shadow border-b border-neutral-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">BuddyFi</Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative flex items-center space-x-4">
                  <div className="flex items-center">
                    {user.avatar_url && (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                      />
                    )}
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.name || user.login}
                    </span>
                  </div>
                  <div>
                    <Link
                      href="/api/logout"
                      className="bg-gray-700 px-3 py-1 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="py-10">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="shadow rounded-lg p-6 border">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-100">
                      GitHub Profile Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Details and information about your GitHub account.
                    </p>
                  </div>
                  <div className="border-t border-gray-500 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-200">Username</dt>
                        <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                          {user.login}
                        </dd>
                      </div>
                      {user.name && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">Full name</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            {user.name}
                          </dd>
                        </div>
                      )}
                      {user.email && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">Email address</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            {user.email}
                          </dd>
                        </div>
                      )}
                      {user.bio && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">Bio</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            {user.bio}
                          </dd>
                        </div>
                      )}
                      {user.location && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">Location</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            {user.location}
                          </dd>
                        </div>
                      )}
                      {user.public_repos !== undefined && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">Public repositories</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            {user.public_repos}
                          </dd>
                        </div>
                      )}
                      {user.followers !== undefined && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">Followers</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            {user.followers}
                          </dd>
                        </div>
                      )}
                      {user.html_url && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-200">GitHub URL</dt>
                          <dd className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
                            <a 
                              href={user.html_url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-500"
                            >
                              {user.html_url}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error parsing GitHub user data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">Error</h3>
            <p className="mt-1 text-sm text-gray-500">There was an error loading your profile data.</p>
            <div className="mt-6">
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
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