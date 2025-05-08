/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';

export default function RepoList({ repos }: { repos: any[] }) {
  const [showAll, setShowAll] = useState(false);

  const filteredRepos = repos.filter(repo => !repo.fork);
  const displayRepos = showAll ? filteredRepos : filteredRepos.slice(0, 6);

  return (
    <div className="my-8 px-4">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Public Repositories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayRepos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-600 rounded-lg p-4 hover:bg-gray-800 transition"
          >
            <h4 className="text-lg font-medium text-indigo-300">{repo.name}</h4>
            <p className="text-sm text-gray-400">{repo.description || 'No description'}</p>
            <div className="text-sm text-gray-500 mt-2">
              ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 🧑‍💻 {repo.language || 'N/A'}
            </div>
          </a>
        ))}
      </div>
      {filteredRepos.length > 6 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm px-4 py-2 border border-gray-500 rounded-md text-indigo-300 hover:bg-gray-700 transition"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        </div>
      )}
    </div>
  );
}
