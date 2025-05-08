/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    // console.log("Cookies in request:", cookieStore); // Log cookies
  
    const userCookie = cookieStore.get('user');
    if (!userCookie) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }
  
    try {
      const user = JSON.parse(userCookie.value);
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({ error: 'Error parsing user data' }, { status: 500 });
    }
  }
  