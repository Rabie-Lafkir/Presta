import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session, error },
  } = await supabase.auth.getSession();

  console.log("Session is :", session);

  if (error) {
    console.log("Session");
  }

  console.log("Middlewear session is,", session);

  // if user is signed in and the current path is Auth redirect the user to /dashboard

  return res;
}

export const config = {
  matcher: ["/login", "register", "/dashboard/:path*"],
};
