import { NextRequest, NextResponse } from "next/server";
import { getAuthConfiguration, generateCodeVerifier, generateCodeChallenge } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ 
      error: "Missing SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID", 
      details: "Please add this to your .env file from your Shopify Headless channel settings." 
    }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const config = await getAuthConfiguration();
  if (!config) {
    return NextResponse.redirect(`${baseUrl}/account/login?error=Discovery failed`);
  }

  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = Math.random().toString(36).substring(2);
  const nonce = Math.random().toString(36).substring(2);

  const authUrl = new URL(config.authorization_endpoint);
  authUrl.searchParams.append("client_id", process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!);
  authUrl.searchParams.append("scope", "openid email customer-account-api:full");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("nonce", nonce);
  authUrl.searchParams.append("code_challenge", challenge);
  authUrl.searchParams.append("code_challenge_method", "S256");

  const response = NextResponse.redirect(authUrl.toString());
  
  const cookieStore = await cookies();
  cookieStore.set("code_verifier", verifier, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 300 // 5 minutes
  });
  cookieStore.set("auth_state", state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 300 
  });

  return response;
}
