import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { 
  getAuthConfiguration, 
  generateCodeVerifier, 
  generateCodeChallenge 
} from "@/lib/auth";

export async function GET() {
  const config = await getAuthConfiguration();
  const cookieStore = await cookies();
  
  const state = Math.random().toString(36).substring(2);
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store transient data in cookies for the callback to verify
  cookieStore.set("auth_state", state, { httpOnly: true, secure: true, maxAge: 600 });
  cookieStore.set("auth_code_verifier", codeVerifier, { httpOnly: true, secure: true, maxAge: 600 });

  const authUrl = new URL(config.authorization_endpoint);
  authUrl.searchParams.set("client_id", process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!);
  authUrl.searchParams.set("scope", "openid email customer-account-api:full");
  authUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(authUrl.toString());
}
