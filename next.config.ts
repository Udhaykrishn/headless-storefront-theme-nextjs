import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async rewrites() {
    const shopifyDomain =
      process.env.SHOPIFY_STORE_DOMAIN || "rebootx-2.myshopify.com";
    return [
      {
        source: "/checkout/:path*",
        destination: `https://${shopifyDomain}/checkout/:path*`,
      },
    ];
  },
};

export default nextConfig;
