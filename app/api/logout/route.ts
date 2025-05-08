// app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Clear the GitHub user cookie
  (await
    // Clear the GitHub user cookie
    cookies()).delete("githubUser");
  
  // Redirect to home page
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}