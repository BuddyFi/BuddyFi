/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code)
    return NextResponse.json({ error: "Missing code" }, { status: 400 });

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const user = userRes.data;

    // Fetch all repos to calculate totalStars
    const reposRes = await axios.get(`https://api.github.com/users/${user.login}/repos?per_page=100`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const repos = reposRes.data;
    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
      : 0;

    // Fetch recent public events to calculate totalCommits
    const eventsRes = await axios.get(`https://api.github.com/users/${user.login}/events/public?per_page=100`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const events = eventsRes.data;
    let totalCommits = 0;
    if (Array.isArray(events)) {
      for (const event of events) {
        if (event.type === "PushEvent" && event.payload && Array.isArray(event.payload.commits)) {
          totalCommits += event.payload.commits.length;
        }
      }
    }

    const userData = {
      login: user.login,
      name: user.name || "",
      avatar_url: user.avatar_url,
      bio: user.bio || "",
      blog: user.blog || "",
      company: user.company || "",
      location: user.location || "",
      email: user.email || "",
      html_url: user.html_url,
      followers: user.followers || 0,
      following: user.following || 0,
      public_repos: user.public_repos || 0,
      created_at: user.created_at,
      totalStars,
      totalCommits,
    };

    // Set cookie using Response object for reliability
    const response = NextResponse.redirect(new URL(`/profile`, request.url));
    response.cookies.set("githubUser", JSON.stringify(userData), {
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60, // 1 hour
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("OAuth Error:", err.response?.data ?? err);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
