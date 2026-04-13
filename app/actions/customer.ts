"use server";

import { cookies } from "next/headers";
import {
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  shopifyClient,
} from "@/lib/shopify";

const TOKEN_KEY = "shopify_customer_access_token";

interface UserError {
  message: string;
  field?: string[];
}

interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress?: { emailAddress: string };
  phoneNumber?: { phoneNumber: string };
  email?: string;
  phone?: string;
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        processedAt: string;
        financialStatus: string;
        fulfillmentStatus: string;
        totalPrice: { amount: string; currencyCode: string };
      };
    }>;
  };
}

export async function createCustomer(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const input = { email, password, firstName, lastName };

  const data = await shopifyClient.request<{
    customerCreate: { customer: unknown; customerUserErrors: UserError[] };
  }>(CUSTOMER_CREATE_MUTATION, { input });

  if (data.customerCreate.customerUserErrors.length > 0) {
    return { error: data.customerCreate.customerUserErrors[0].message };
  }

  // Auto-login after registration
  return loginCustomer(prevState, formData);
}

export async function loginCustomer(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const input = { email, password };

  const data = await shopifyClient.request<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string };
      customerUserErrors: UserError[];
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
  const token = (await cookieStore).get(TOKEN_KEY);

  if (!token?.value) return null;

  try {
    const { customerAccountClient, GET_CUSTOMER_ACCOUNT_QUERY } = await import(
      "@/lib/shopify"
    );
    const data = await customerAccountClient(token.value).request<{
      customer: ShopifyCustomer & { 
        addresses: { edges: Array<{ node: any }> } 
      };
    }>(GET_CUSTOMER_ACCOUNT_QUERY);

    // Normalize the data (Customer Account API uses emailAddress/phoneNumber objects)
    const customer = data.customer;
    const addresses = customer.addresses?.edges.map(edge => ({
      ...edge.node,
      // Map for legacy UI compatibility if needed
      province: edge.node.zoneCode,
      country: edge.node.territoryCode
    })) || [];

    return {
      ...customer,
      email: customer.emailAddress?.emailAddress,
      phone: customer.phoneNumber?.phoneNumber,
      addresses: { edges: customer.addresses?.edges || [] },
      normalizedAddresses: addresses,
      orders: {
        ...customer.orders,
        edges: customer.orders?.edges.map((edge) => ({
          ...edge,
          node: {
            ...edge.node,
            orderNumber: edge.node.name, // Map for UI compatibility
          },
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch customer", error);
    return null;
  }
}

export async function getCustomerToken() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_KEY);
  return tokenCookie?.value ?? null;
}

export async function updateCustomerProfile(
  _prevState: any,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_KEY);
  if (!tokenCookie?.value) return { success: false, error: "Not authenticated" };

  const input: any = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
  };

  const phone = formData.get("phone") as string;
  if (phone) {
    input.phone = phone;
  }

  const { shopifyClient, CUSTOMER_UPDATE_MUTATION } = await import("@/lib/shopify");

  try {
    const data = await shopifyClient.request<{
      customerUpdate: { customer: { id: string }; customerUserErrors: UserError[] };
    }>(CUSTOMER_UPDATE_MUTATION, { 
      customerAccessToken: tokenCookie.value,
      customer: input 
    });

    if (data.customerUpdate.customerUserErrors.length > 0) {
      return { success: false, error: data.customerUpdate.customerUserErrors[0].message };
    }
    return { success: true };
  } catch (error: any) {
    console.error("Profile update failed", error?.response?.errors || error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getOrder(orderId: string) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_KEY);
  if (!tokenCookie?.value) return null;

  const { customerAccountClient } = await import("@/lib/shopify");

  const query = `
    query getOrder($id: ID!) {
      customer {
        orders(first: 1, query: $id) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount, currencyCode }
              subtotalPrice { amount, currencyCode }
              totalShippingPrice { amount, currencyCode }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      title
                      price { amount, currencyCode }
                      image { url, altText }
                      product { handle }
                    }
                  }
                }
              }
              shippingAddress {
                firstName, lastName, address1, address2, city, province, zip, country
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await customerAccountClient(tokenCookie.value).request<{
      customer: { orders: { edges: Array<{ node: any }> } };
    }>(query, { id: orderId });

    const order = data.customer.orders.edges[0]?.node;
    if (!order) return null;

    return {
      ...order,
      orderNumber: order.name, // Map for UI compatibility
    };
  } catch (error) {
    console.error("Failed to fetch order", error);
    return null;
  }
}

export async function createCustomerAddress(
  _prevState: any,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_KEY);
  if (!tokenCookie?.value) return { success: false, error: "Not authenticated" };

  const customer = await getCustomer();
  if (!customer?.id) return { success: false, error: "Customer ID not found" };

  // Helper to map all Indian states and UTs to their ISO codes (ZoneCode)
  const stateToCode: Record<string, string> = {
    "Andaman and Nicobar Islands": "AN",
    "Andhra Pradesh": "AP",
    "Arunachal Pradesh": "AR",
    "Assam": "AS",
    "Bihar": "BR",
    "Chandigarh": "CH",
    "Chhattisgarh": "CT",
    "Dadra and Nagar Haveli": "DN",
    "Daman and Diu": "DD",
    "Delhi": "DL",
    "Goa": "GA",
    "Gujarat": "GJ",
    "Haryana": "HR",
    "Himachal Pradesh": "HP",
    "Jammu and Kashmir": "JK",
    "Jharkhand": "JH",
    "Karnataka": "KA",
    "Kerala": "KL",
    "Ladakh": "LA",
    "Lakshadweep": "LD",
    "Madhya Pradesh": "MP",
    "Maharashtra": "MH",
    "Manipur": "MN",
    "Meghalaya": "ML",
    "Mizoram": "MZ",
    "Nagaland": "NL",
    "Odisha": "OR",
    "Puducherry": "PY",
    "Punjab": "PB",
    "Rajasthan": "RJ",
    "Sikkim": "SK",
    "Tamil Nadu": "TN",
    "Telangana": "TG",
    "Tripura": "TR",
    "Uttar Pradesh": "UP",
    "Uttarakhand": "UT",
    "West Bengal": "WB",
  };

  const province = formData.get("province") as string;
  const zoneCode = stateToCode[province] || province;
  
  // Format phone to E.164 if it's a 10-digit number
  let phone = formData.get("phone") as string || "";
  if (phone && phone.length === 10 && !phone.startsWith("+")) {
    phone = `+91${phone}`;
  } else if (phone && phone.length === 12 && phone.startsWith("91") && !phone.startsWith("+")) {
    phone = `+${phone}`;
  }

  // Dual Mapping Strategy as per Shopify Guidelines:
  
  // 1. Customer Account API Payload (CustomerAddressInput)
  const customerAccountAddress = {
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    address1: formData.get("address1") as string,
    address2: (formData.get("address2") as string) || "",
    city: formData.get("city") as string,
    territoryCode: "IN", 
    zoneCode: zoneCode,
    zip: formData.get("zip") as string,
    phoneNumber: phone,
    company: (formData.get("company") as string) || "",
  };

  const { customerAccountClient, CUSTOMER_ADDRESS_CREATE_MUTATION } = await import("@/lib/shopify");

  try {
    const data = await customerAccountClient(tokenCookie.value).request<{
      customerAddressCreate: { 
        customerAddress: any; 
        userErrors: Array<{ field: string[]; message: string; code?: string }> 
      };
    }>(CUSTOMER_ADDRESS_CREATE_MUTATION, { 
      customerId: customer.id,
      address: customerAccountAddress, 
    });

    if (data.customerAddressCreate.userErrors.length > 0) {
      const error = data.customerAddressCreate.userErrors[0];
      console.error("Shopify Address Validation Error:", error);
      return { success: false, error: `${error.message}${error.field ? ` (${error.field.join(", ")})` : ""}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Address creation failed [Critical Exception]:", error?.response?.errors || error);
    return { success: false, error: "Failed to create address. Please check your data." };
  }
}

export async function deleteCustomerAddress(addressId: string) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_KEY);
  if (!tokenCookie?.value) return { error: "Not authenticated" };

  const customer = await getCustomer();
  if (!customer?.id) return { error: "Customer ID not found" };

  const { customerAccountClient, CUSTOMER_ADDRESS_DELETE_MUTATION } = await import("@/lib/shopify");

  try {
    const data = await customerAccountClient(tokenCookie.value).request<{
      customerAddressDelete: { deletedAddressId: string; userErrors: UserError[] };
    }>(CUSTOMER_ADDRESS_DELETE_MUTATION, { 
      addressId,
      customerId: customer.id,
    });

    if (data.customerAddressDelete.userErrors.length > 0) {
      return { error: data.customerAddressDelete.userErrors[0].message };
    }
    return { success: true };
  } catch (error) {
    console.error("Address deletion failed", error);
    return { error: "Failed to delete address" };
  }
}
