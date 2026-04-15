import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieStore = await cookies();

  const savedState = cookieStore.get("auth_state")?.value;
  const codeVerifier = cookieStore.get("auth_code_verifier")?.value;

  // Use the public app URL as the base for redirects, or fallback to the current request origin
  const currentOrigin = new URL(request.url).origin;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || currentOrigin;
  const isLocal = currentOrigin.includes("localhost");

  if (!code || state !== savedState || !codeVerifier) {
    return NextResponse.redirect(
      new URL("/account/login?error=Invalid session state", baseUrl),
    );
  }

  const tokenData = await getAccessToken(code, codeVerifier);

  if (!tokenData) {
    return NextResponse.redirect(
      new URL("/account/login?error=Authentication failed", baseUrl),
    );
  }

  // Set the access token in an HTTP-only cookie
  cookieStore.set("shopify_customer_access_token", tokenData.access_token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: "lax",
    path: "/",
    maxAge: tokenData.expires_in,
  });

  if (tokenData.id_token) {
    cookieStore.set("shopify_customer_id_token", tokenData.id_token, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: "lax",
      path: "/",
      maxAge: tokenData.expires_in,
    });
  }

  // Use refresh token if provided
  if (tokenData.refresh_token) {
    cookieStore.set("shopify_customer_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Clean up transient cookies
  cookieStore.delete("auth_state");
  cookieStore.delete("auth_code_verifier");

  return NextResponse.redirect(new URL("/account", baseUrl));
}
