/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check rate limit status
async function checkRateLimit(config: any) {
  try {
    const response = await axios.get(
      "https://api.github.com/rate_limit",
      config
    );
    console.log("Rate limit status:", response.data.rate);
    return response.data.rate;
  } catch (err) {
    console.log("Could not check rate limit:", err);
    return null;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const params = await context.params;
  const username = params.username;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  const config = {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "NextJS-GitHub-Profiler",
    },
    timeout: 5000, // 10 second timeout
  };

  try {
    // Check rate limit first
    const rateLimit = await checkRateLimit(config);
    if (rateLimit && rateLimit.remaining < 50) {
      return NextResponse.json(
        {
          error: "Rate limit too low to process request",
          remaining: rateLimit.remaining,
          reset: new Date(rateLimit.reset * 1000).toISOString(),
        },
        { status: 429 }
      );
    }

    // 1. Basic Profile
    const { data: profile } = await axios.get(
      `https://api.github.com/users/${username}`,
      config
    );

    console.log("Profile fetched successfully");
    await delay(500); // Wait 500ms between major requests

    // 1. Fetch all repos and filter out forks
    const { data: repos } = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      config
    );
    const userRepos = repos.filter((repo: any) => !repo.fork);

    console.log(`Found ${userRepos.length} user repositories`);
    await delay(500); // small buffer

    // 2. Get total commits for each repo
    const reposWithCommits = [];

    for (const repo of userRepos) {
      try {
        await delay(200); // throttle
        const activityRes = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/stats/commit_activity`,
          config
        );
        const activity = activityRes.data;
        if (Array.isArray(activity)) {
          const totalCommits = activity.reduce(
            (sum: number, week: any) => sum + week.total,
            0
          );
          reposWithCommits.push({ ...repo, totalCommits });
        }
      } catch (err: any) {
        console.log(
          `Skipping ${repo.name}, couldn't fetch activity:`,
          err.response?.status
        );
      }
    }

    // 3. Sort repos by total commits
    reposWithCommits.sort((a, b) => b.totalCommits - a.totalCommits);

    // 4. Process top 5 repos by commit count
    const languageTotals: Record<string, number> = {};
    const topProjects = [];

    for (let i = 0; i < Math.min(reposWithCommits.length, 5); i++) {
      const repo = reposWithCommits[i];
      try {
        console.log(`Processing top repo ${i + 1}: ${repo.name}`);
        await delay(300); // throttle

        const langRes = await axios.get(repo.languages_url, config);
        for (const [lang, bytes] of Object.entries(langRes.data)) {
          languageTotals[lang] =
            (languageTotals[lang] || 0) + (bytes as number);
        }

        // Get last month commit count again (could reuse earlier data too)
        let commitsLastMonth = 0;
        const activityRes = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/stats/commit_activity`,
          config
        );
        const activity = activityRes.data;
        if (Array.isArray(activity)) {
          const last4Weeks = activity.slice(-4);
          commitsLastMonth = last4Weeks.reduce(
            (sum: number, week: any) => sum + week.total,
            0
          );
        }

        topProjects.push({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics,
          language: repo.language,
          commits_last_month: commitsLastMonth,
          pushed_at: repo.pushed_at,
        });
      } catch (err: any) {
        console.log(
          `Error processing repo ${repo.name}:`,
          err.response?.status,
          err.message
        );
      }
    }

    // 5. Calculate language weights
    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);
    const language_weights =
      totalBytes > 0
        ? Object.fromEntries(
            Object.entries(languageTotals).map(([lang, val]) => [
              lang,
              +(val / totalBytes).toFixed(3),
            ])
          )
        : {};

    // 3. Issues, PRs, Reviews Count - back to full search
    let activityMetrics = {
      total_issues: 0,
      total_prs: 0,
      total_reviews: 0,
    };

    try {
      //   console.log("Fetching activity metrics...");
      await delay(500); // Wait before search API calls

      const [issuesRes, prsRes, reviewsRes] = await Promise.all([
        axios.get(
          `https://api.github.com/search/issues?q=author:${username}+type:issue`,
          config
        ),
        axios.get(
          `https://api.github.com/search/issues?q=author:${username}+type:pr`,
          config
        ),
        axios.get(
          `https://api.github.com/search/issues?q=reviewed-by:${username}`,
          config
        ),
      ]);

      activityMetrics = {
        total_issues: issuesRes.data.total_count,
        total_prs: prsRes.data.total_count,
        total_reviews: reviewsRes.data.total_count,
      };

      console.log("✓ Activity metrics fetched successfully");
    } catch (err: any) {
      console.log(
        "Could not fetch activity metrics:",
        err.response?.status,
        err.message
      );
    }

    // 4. Commit activity (weekly - global)
    const commitWeeks: number[] = [];
    try {
      if (userRepos.length > 0) {
        // console.log("Fetching global commit activity...");
        await delay(300);

        const repo = userRepos[0];
        const activityRes = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/stats/commit_activity`,
          config
        );
        if (Array.isArray(activityRes.data)) {
          const last4Weeks = activityRes.data.slice(-4);
          for (const week of last4Weeks) {
            commitWeeks.push(week.total);
          }
        }
        console.log("✓ Global commit activity fetched");
      }
    } catch (err: any) {
      console.log(
        "Could not fetch commit activity:",
        err.response?.status,
        err.message
      );
    }

    // 5. Starred Repos → Interests
    const interests = new Set<string>();
    try {
      //   console.log("Fetching starred repos for interests...");
      await delay(300);

      const { data: starred } = await axios.get(
        `https://api.github.com/users/${username}/starred?per_page=100`,
        config
      );

      for (const repo of starred) {
        if (repo.topics) repo.topics.forEach((t: string) => interests.add(t));
      }

      console.log(
        `✓ Analyzed ${starred.length} starred repos, found ${interests.size} interests`
      );
    } catch (err: any) {
      console.log(
        "Could not fetch starred repos:",
        err.response?.status,
        err.message
      );
    }

    // 6. Final Skill Profile
    const skillProfile = {
      username,
      profile: {
        name: profile.name,
        email: profile.email,
        twitter_username: profile.twitter_username,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        blog: profile.blog,
        location: profile.location,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        joined_at: profile.created_at,
      },
      language_weights,
      top_projects: topProjects.slice(0, 5),
      activity: {
        ...activityMetrics,
        commit_frequency_last_4_weeks: commitWeeks,
      },
      interests: Array.from(interests),
      fetched_at: new Date().toISOString(),
    };

    console.log(
      "Developer Skill Profile:",
      JSON.stringify(skillProfile, null, 2)
    );

    return NextResponse.json({
      message: "Profile extracted successfully. Check server logs.",
      data: skillProfile,
    });
  } catch (err: any) {
    console.error("Error generating skill profile:", err.message);

    // Check if it's a rate limit error
    if (err.response?.status === 403) {
      const rateLimitRemaining = err.response?.headers["x-ratelimit-remaining"];
      const rateLimitReset = err.response?.headers["x-ratelimit-reset"];

      return NextResponse.json(
        {
          error: "GitHub API rate limit exceeded or authentication failed",
          details: {
            remaining: rateLimitRemaining,
            reset: rateLimitReset,
            message: err.response?.data?.message || err.message,
          },
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
