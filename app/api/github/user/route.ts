import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const githubCookie = (await cookies()).get("githubUser");
  if (!githubCookie || !githubCookie.value) {
    return NextResponse.json({ error: "Not linked" }, { status: 401 });
  }
  let user;
  try {
    user = JSON.parse(githubCookie.value);
  } catch {
    return NextResponse.json({ error: "Invalid cookie" }, { status: 400 });
  }

  // Optionally, you could store the access_token in a secure cookie/session and use it here
  // For now, just return the user data from the cookie
  // If you want to fetch more data (repos, contributions), you need the access_token

  // Example: Fetch public repos (if you have access_token)
  // const reposRes = await axios.get(`https://api.github.com/users/${user.login}/repos?per_page=100&sort=updated`);
  // const repos = reposRes.data;

  // Example: Fetch events for contributions
  // const eventsRes = await axios.get(`https://api.github.com/users/${user.login}/events/public`);
  // const events = eventsRes.data;

  // For now, just return the user profile
  return NextResponse.json(user);
} 