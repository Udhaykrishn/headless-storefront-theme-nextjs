import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthConfiguration } from "@/lib/auth";

export async function GET(_request: Request) {
  const cookieStore = await cookies();
  const config = await getAuthConfiguration();
  const idToken = cookieStore.get("shopify_customer_id_token")?.value;

  // Clear local cookies
  cookieStore.delete("shopify_customer_access_token");
  cookieStore.delete("shopify_customer_id_token");
  cookieStore.delete("shopify_customer_refresh_token");

  const logoutUrl = new URL(
    config.end_session_endpoint ||
    config.logout_endpoint ||
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/account/logout`,
  );

  if (idToken) {
    logoutUrl.searchParams.set("id_token_hint", idToken);
  }

  logoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    process.env.NEXT_PUBLIC_APP_URL!,
  );

  return NextResponse.redirect(logoutUrl.toString());
}
