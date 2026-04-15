import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || "rebootx-2.myshopify.com";
  
  // Reconstruct the Shopify URL
  const path = slug.join("/");
  const shopifyUrl = `https://${shopifyDomain}/cart/c/${path}${url.search}`;

  console.log("Proxying (No-Loop) to Shopify:", shopifyUrl);

  try {
    const response = await fetch(shopifyUrl, {
      headers: {
        "Host": shopifyDomain, // Force the host to avoid the primary domain redirect loop
        "User-Agent": request.headers.get("user-agent") || "",
        "Accept": request.headers.get("accept") || "*/*",
        "Cookie": request.headers.get("cookie") || "",
        "Referer": `https://${shopifyDomain}/`,
        "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
      },
      redirect: 'manual'
    });

    console.log("Shopify Response Status:", response.status);

    // Handle redirects carefully to avoid loops
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log("Shopify Redirecting to:", location);
      
      if (location) {
        // If Shopify is trying to redirect us back to our own domain's cart, 
        // it means we've hit a logic loop. We should try to follow it internally or stop.
        if (location.includes(url.host) && location.includes('/cart/c/')) {
           console.warn("Detected potential redirect loop back to custom domain. Stopping.");
           // Return a message instead of looping
           return new Response("Checkout redirect loop detected. Please try again or contact support.", { status: 500 });
        }
        
        return NextResponse.redirect(location);
      }
    }

    const data = await response.text();
    
    const headers = new Headers();
    headers.set("Content-Type", "text/html");
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      headers.set("Set-Cookie", setCookie);
    }

    return new Response(data || "<!-- Empty response from Shopify -->", {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error("Shopify Proxy Error:", error);
    return NextResponse.redirect(shopifyUrl);
  }
}
