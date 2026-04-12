"use server";

import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
  type CartInfo,
  GET_CART_QUERY,
  shopifyClient,
} from "@/lib/shopify";
import { getCustomerToken } from "./customer";

export async function createCart() {
  const { getCustomer } = await import("./customer");
  const customer = await getCustomer();
  const buyerIdentity = customer?.email ? { email: customer.email } : {};

  const data = await shopifyClient.request<{
    cartCreate: { cart: { id: string }; userErrors: any[] };
  }>(CART_CREATE_MUTATION, {
    input: {
      buyerIdentity,
    },
  });
  return data.cartCreate.cart;
}

export async function createCheckout(merchandiseId: string, quantity: number) {
  const { getCustomer } = await import("./customer");
  const customer = await getCustomer();
  const buyerIdentity = customer?.email ? { email: customer.email } : {};

  const data = await shopifyClient.request<{
    cartCreate: { cart: { checkoutUrl: string }; userErrors: any[] };
  }>(CART_CREATE_MUTATION, {
    input: {
      lines: [{ merchandiseId, quantity }],
      buyerIdentity,
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart.checkoutUrl;
}

export async function addToCart(
  cartId: string | null,
  lines: { merchandiseId: string; quantity: number }[],
) {
  if (!cartId) {
    const cart = await createCart();
    cartId = cart.id;
  }

  const data = await shopifyClient.request<{
    cartLinesAdd: { cart: CartInfo; userErrors: any[] };
  }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines,
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyClient.request<{
    cartLinesRemove: { cart: CartInfo; userErrors: any[] };
  }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds,
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}

export async function getCartData(cartId: string) {
  const data = await shopifyClient.request<{ cart: CartInfo }>(GET_CART_QUERY, {
    cartId,
  });
  return data.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
) {
  const data = await shopifyClient.request<{
    cartLinesUpdate: { cart: CartInfo; userErrors: any[] };
  }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

export async function updateCartBuyerIdentity(cartId: string) {
  const { getCustomer } = await import("./customer");
  const customer = await getCustomer();
  if (!customer?.email) return null;

  const data = await shopifyClient.request<{
    cartBuyerIdentityUpdate: { cart: CartInfo; userErrors: any[] };
  }>(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
    cartId,
    buyerIdentity: {
      email: customer.email,
    },
  });

  if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
    console.error(
      "Cart buyer identity update error:",
      data.cartBuyerIdentityUpdate.userErrors,
    );
    return null;
  }

  return data.cartBuyerIdentityUpdate.cart;
}
