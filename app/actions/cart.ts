"use server";

import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
  SET_CUSTOMER_METAFIELD_MUTATION,
  type CartInfo,
  GET_CART_QUERY,
  shopifyClient,
} from "@/lib/shopify";
import { getCustomer, getCustomerToken } from "./customer";

export async function createCart() {
  const customer = await getCustomer();
  const token = await getCustomerToken();
  const buyerIdentity: any = customer?.email ? { email: customer.email } : {};
  if (token) buyerIdentity.customerAccessToken = token;

  const data = await shopifyClient.request<{
    cartCreate: { cart: { id: string }; userErrors: any[] };
  }>(CART_CREATE_MUTATION, {
    input: {
      buyerIdentity,
    },
  });

  const cart = data.cartCreate.cart;

  // If user is logged in, save the cart ID to their profile
  if (customer?.id && cart?.id) {
    await saveCartToCustomer(customer.id, cart.id);
  }

  return cart;
}

export async function saveCartToCustomer(customerId: string, cartId: string) {
  const token = await getCustomerToken();
  if (!token) return;

  const { customerAccountClient } = await import("@/lib/shopify");

  try {
    const data = await customerAccountClient(token).request<{
      metafieldsSet: {
        metafields: any[];
        userErrors: Array<{ message: string; field: string[]; code: string }>;
      };
    }>(SET_CUSTOMER_METAFIELD_MUTATION, {
      metafields: [
        {
          key: "cart_id",
          namespace: "custom",
          ownerId: customerId,
          type: "single_line_text_field",
          value: cartId,
        },
      ],
    });

    if (data.metafieldsSet.userErrors.length > 0) {
      console.error(
        "Metafield sync errors:",
        JSON.stringify(data.metafieldsSet.userErrors, null, 2),
      );
    } else {
      console.log("Successfully saved cartId to customer cloud profile:", cartId);
    }
  } catch (error) {
    console.error("Failed to save cart to customer (network/auth error):", error);
  }
}

export async function createCheckout(merchandiseId: string, quantity: number) {
  const { getCustomer, getCustomerToken } = await import("./customer");
  const customer = await getCustomer();
  const token = await getCustomerToken();
  const buyerIdentity: any = customer?.email ? { email: customer.email } : {};
  if (token) buyerIdentity.customerAccessToken = token;

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
  const { getCustomer, getCustomerToken } = await import("./customer");
  const customer = await getCustomer();
  const token = await getCustomerToken();
  if (!customer?.email) return null;

  const buyerIdentity: any = { email: customer.email };
  if (token) buyerIdentity.customerAccessToken = token;

  const data = await shopifyClient.request<{
    cartBuyerIdentityUpdate: { cart: CartInfo; userErrors: any[] };
  }>(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
    cartId,
    buyerIdentity,
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
