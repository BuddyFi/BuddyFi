/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

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

  try {
    const eventsRes = await axios.get(
      `https://api.github.com/users/${user.login}/events/public?per_page=10`
    );
    const events = eventsRes.data.map((event: any) => {
      if (event.type === "PushEvent") {
        return {
          ...event,
          commit_count: event.payload.commits ? event.payload.commits.length : 0,
        };
      }
      return event;
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error("Failed to fetch activity", err);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
} 