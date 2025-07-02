// app/api/github/login/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  
  // Set the scope based on what permissions you need
  const scope = "read:user user:email read:public_repo repo:status read:org";
  
  // Redirect to GitHub's OAuth page
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=${scope}`;
  
  return NextResponse.redirect(githubAuthUrl);
}