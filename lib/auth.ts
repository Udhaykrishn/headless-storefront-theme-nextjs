import { cookies } from "next/headers";

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`;

export async function getAuthConfiguration() {
  // The root discovery URL is often the most reliable for New Customer Accounts
  const discoveryUrls = [
    `https://${SHOP_DOMAIN}/.well-known/openid-configuration`,
    `https://${SHOP_DOMAIN}/auth/customer/.well-known/openid-configuration`,
  ];
  
  for (const url of discoveryUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn(`Discovery failed on ${url}, trying next...`);
    }
  }

  // Final fallback attempt via Shop ID
  try {
    const { getShopId } = await import("./shopify");
    const shopId = await getShopId();
    
    if (shopId) {
      const shopIdUrl = `https://shopify.com/${shopId}/auth/customer/.well-known/openid-configuration`;
      const response = await fetch(shopIdUrl);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    console.error("Shop ID fallback discovery failed");
  }
    
  throw new Error(`OIDC Discovery failed. Please ensure "New Customer Accounts" is enabled in Shopify Admin > Settings > Customer Accounts.`);
}

export async function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return b64(array);
}

export async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return b64(new Uint8Array(digest));
}

function b64(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(code: string, codeVerifier: string) {
  const config = await getAuthConfiguration();
  if (!config) return null;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Token exchange failed", err);
    return null;
  }

  return await response.json();
}
