import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

const endpoint = `https://${domain}/api/2024-04/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken as string,
    "Content-Type": "application/json",
  },
});

export const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int, $last: Int, $after: String, $before: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, last: $last, after: $after, before: $before, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        cursor
        node {
          id
          title
          handle
          descriptionHtml
          priceRange {
            maxVariantPrice { amount, currencyCode }
          }
          images(first: 1) {
            edges { node { url, altText } }
          }
        }
      }
      pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      variants(first: 100) { 
        edges { 
          node { 
            id, availableForSale, title, 
            price { amount, currencyCode }, 
            selectedOptions { name, value } 
          } 
        } 
      }
      options { name, values }
      priceRange { maxVariantPrice { amount, currencyCode } }
      images(first: 5) { edges { node { url, altText } } }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title, handle }
                  price { amount, currencyCode }
                  image { url, altText }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount { amount, currencyCode }
          totalAmount { amount, currencyCode }
        }
      }
      userErrors { field, message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise { 
                ... on ProductVariant { 
                  id, title, product { title, handle }, 
                  price { amount, currencyCode }, image { url, altText } 
                } 
              }
            }
          }
        }
        cost { 
          subtotalAmount { amount, currencyCode }, 
          totalAmount { amount, currencyCode }
        }
      }
      userErrors { field, message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise { 
                ... on ProductVariant { 
                  id, title, product { title, handle }, 
                  price { amount, currencyCode }, image { url, altText } 
                } 
              }
            }
          }
        }
        cost { 
          subtotalAmount { amount, currencyCode }, 
          totalAmount { amount, currencyCode }
        }
      }
      userErrors { field, message }
    }
  }
`;

export const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product { title, handle }
                price { amount, currencyCode }
                image { url, altText }
              }
            }
          }
        }
      }
      cost {
        subtotalAmount { amount, currencyCode }
        totalAmount { amount, currencyCode }
      }
    }
  }
`;

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  options: { name: string; values: string[] }[];
  variants: {
    edges: {
      node: {
        id: string;
        availableForSale: boolean;
        title: string;
        price: { amount: string; currencyCode: string };
        selectedOptions: { name: string; value: string }[];
      };
    }[];
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
}

export interface ProductsResponse {
  products: {
    edges: {
      cursor: string;
      node: ShopifyProduct;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface ProductResponse {
  product: ShopifyProduct;
}

export const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id, firstName, lastName, email }
      customerUserErrors { code, field, message }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken, expiresAt }
      customerUserErrors { code, field, message }
    }
  }
`;

export const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount, currencyCode }
          }
        }
      }
    }
  }
`;

export interface CartInfo {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: { title: string; handle: string };
          price: { amount: string; currencyCode: string };
          image: { url: string; altText: string } | null;
        };
      };
    }[];
  };
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
}

export async function getProduct(handle: string) {
  const data = await shopifyClient.request<ProductResponse>(
    GET_PRODUCT_BY_HANDLE_QUERY,
    { handle },
  );
  return data.product;
}

export async function getProducts({
  sortKey = "BEST_SELLING",
  reverse = false,
  query = "",
  first,
  last,
  after,
  before,
}: {
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
} = {}) {
  // Setup pagination variables limit 20. If neither first nor last is provided, default to first 20.
  let f = first;
  let l = last;
  if (!first && !last) {
    f = 20;
  }

  const data = await shopifyClient.request<ProductsResponse>(
    GET_PRODUCTS_QUERY,
    { first: f, last: l, sortKey, reverse, query, after, before },
  );
  return data.products;
}

export async function getCart(cartId: string) {
  const data = await shopifyClient.request<{ cart: CartInfo }>(GET_CART_QUERY, {
    cartId,
  });
  return data.cart;
}
