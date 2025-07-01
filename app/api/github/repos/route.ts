import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
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

  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const perPage = showAll ? 100 : 10;
    const reposRes = await axios.get(
      `https://api.github.com/users/${user.login}/repos?per_page=${perPage}&sort=updated`
    );
    return NextResponse.json(reposRes.data);
  } catch (err) {
    console.error("Failed to fetch repos", err);
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
} 