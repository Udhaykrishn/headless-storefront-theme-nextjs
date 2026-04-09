import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const storedVerifier = cookieStore.get("code_verifier")?.value;
  const storedState = cookieStore.get("auth_state")?.value;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code || !state || !storedVerifier || state !== storedState) {
    console.error("Auth callback validation failed", { code, state, storedState });
    return NextResponse.redirect(`${baseUrl}/account/login?error=Invalid session`);
  }

  const tokenData = await getAccessToken(code, storedVerifier);

  if (!tokenData || !tokenData.access_token) {
    return NextResponse.redirect(`${baseUrl}/account/login?error=Token exchange failed`);
  }

  const response = NextResponse.redirect(`${baseUrl}/account`);
  
  response.cookies.set("shopify_customer_access_token", tokenData.access_token, {
    httpOnly: true,
    secure: true, 
    sameSite: "lax",
    maxAge: tokenData.expires_in || 3600,
    path: "/",
  });

  // Clean up auth cookies
  response.cookies.delete("code_verifier");
  response.cookies.delete("auth_state");

  return response;
}
