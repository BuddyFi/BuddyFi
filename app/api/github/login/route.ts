// app/api/github/login/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  
  const scope = "read:user user:email read:org repo:status";

  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=${scope}`;
  
  return NextResponse.redirect(githubAuthUrl);
}