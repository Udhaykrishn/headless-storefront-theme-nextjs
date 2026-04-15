
import { shopifyClient } from "../lib/shopify";

async function checkShopId() {
  const query = `{ shop { id } }`;
  try {
    const data = await shopifyClient.request<{ shop: { id: string } }>(query);
    console.log("Real Shop ID GID:", data.shop.id);
    console.log("Real Shop ID (numeric):", data.shop.id.split("/").pop());
  } catch (err) {
    console.error("Error fetching shop ID:", err);
  }
}

checkShopId();
