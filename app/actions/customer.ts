"use server";

import {
  shopifyClient,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  GET_CUSTOMER_QUERY,
} from "@/lib/shopify";
import { cookies } from "next/headers";

const TOKEN_KEY = "shopify_customer_access_token";

export async function createCustomer(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const input = { email, password, firstName, lastName };

  const data = await shopifyClient.request<{
    customerCreate: { customer: any; customerUserErrors: any[] };
  }>(CUSTOMER_CREATE_MUTATION, { input });

  if (data.customerCreate.customerUserErrors.length > 0) {
    return { error: data.customerCreate.customerUserErrors[0].message };
  }

  // Auto-login after registration
  return loginCustomer(prevState, formData);
}

export async function loginCustomer(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const input = { email, password };

  const data = await shopifyClient.request<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string };
      customerUserErrors: any[];
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { input });

  const errors = data.customerAccessTokenCreate.customerUserErrors;
  if (errors.length > 0) {
    return { error: errors[0].message };
  }

  const tokenInfo = data.customerAccessTokenCreate.customerAccessToken;

  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_KEY,
    value: tokenInfo.accessToken,
    expires: new Date(tokenInfo.expiresAt),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return { success: true };
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  return { success: true };
}

export async function getCustomer() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_KEY);

  if (!tokenCookie?.value) {
    return null;
  }

  try {
    const data = await shopifyClient.request<{ customer: any }>(
      GET_CUSTOMER_QUERY,
      { customerAccessToken: tokenCookie.value },
    );
    return data.customer;
  } catch (error) {
    console.error("Failed to fetch customer", error);
    return null;
  }
}
