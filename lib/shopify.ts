import { GraphQLClient } from "graphql-request";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

const endpoint = `https://${domain}/api/2024-04/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken as string,
    "Content-Type": "application/json",
  },
});

export const customerAccountClient = (accessToken: string) => {
  const shopId = "79508275445";
  const url = `https://shopify.com/${shopId}/account/customer/api/2026-04/graphql`;

  return new GraphQLClient(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
  });
};

export const GET_CUSTOMER_ACCOUNT_QUERY = `
  query getCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      orders(first: 10, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount, currencyCode }
          }
        }
      }
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
      }
      metafield(namespace: "custom", key: "cart_id") {
        value
      }
    }
  }
`;

export const SET_CUSTOMER_METAFIELD_MUTATION = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

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
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
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

export const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int) {
    collections(first: $first, sortKey: RELEVANCE) {
      edges {
        node {
          id
          title
          handle
          description
          image { url, altText }
          products(first: 1) { edges { node { id } } }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  query getCollection($handle: String!, $first: Int, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image { url, altText }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          cursor
          node {
            id
            title
            handle
            priceRange { maxVariantPrice { amount, currencyCode } }
            images(first: 1) { edges { node { url, altText } } }
          }
        }
        pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
      }
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = `
  query searchProducts($query: String!, $first: Int, $after: String) {
    products(first: $first, after: $after, query: $query, sortKey: RELEVANCE) {
      edges {
        cursor
        node {
          id
          title
          handle
          priceRange { maxVariantPrice { amount, currencyCode } }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
          images(first: 1) { edges { node { url, altText } } }
        }
      }
      pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
    }
  }
`;

export const GET_PAGE_QUERY = `
  query getPage($handle: String!) {
    page(handle: $handle) {
      id, title, handle, body, seo { title, description }
    }
  }
`;

export const GET_ORDER_QUERY = `
  query getOrder($customerAccessToken: String!, $orderId: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderId) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount, currencyCode }
            subtotalPrice { amount, currencyCode }
            totalShippingPrice { amount, currencyCode }
            shippingAddress {
              firstName, lastName, address1, address2, city, province, zip, country
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id, title
                    price { amount, currencyCode }
                    image { url, altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ADDRESSES_QUERY = `
  query getCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress { id, address1, address2, city, province, zip, country, firstName, lastName, phone }
      addresses(first: 10) {
        edges {
          node { id, address1, address2, city, province, zip, country, firstName, lastName, phone }
        }
      }
    }
  }
`;

export const GET_CUSTOMER_PROFILE_QUERY = `
  query getCustomerProfile($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id, firstName, lastName, email, phone
    }
  }
`;

export const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id, firstName, lastName, email, phone }
      customerUserErrors { code, field, message }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      vendor
      productType
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
      images(first: 10) { edges { node { url, altText } } }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
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
        totalQuantity
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

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        lines(first: 100) {
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
          subtotalAmount { amount, currencyCode }
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
        totalQuantity
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

export const CART_BUYER_IDENTITY_UPDATE_MUTATION = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        totalQuantity
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
        buyerIdentity {
          email
          customer {
            id
          }
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
      totalQuantity
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
      buyerIdentity {
        email
        customer {
          id
        }
      }
    }
  }
`;

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml: string;
  vendor?: string;
  productType?: string;
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
  totalQuantity: number;
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
  buyerIdentity?: {
    email: string;
    customer?: {
      id: string;
    };
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
  const l = last;
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

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: { url: string; altText: string } | null;
}

export interface CollectionsResponse {
  collections: {
    edges: { node: ShopifyCollection }[];
  };
}

export interface CollectionResponse {
  collection: ShopifyCollection & {
    products: {
      edges: { cursor: string; node: ShopifyProduct }[];
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      };
    };
  };
}

export async function getCollections(first = 20) {
  const data = await shopifyClient.request<CollectionsResponse>(
    GET_COLLECTIONS_QUERY,
    { first },
  );
  return data.collections.edges.map((e) => e.node);
}

export async function getCollection({
  handle,
  first = 20,
  after,
  sortKey = "BEST_SELLING",
  reverse = false,
}: {
  handle: string;
  first?: number;
  after?: string;
  sortKey?: string;
  reverse?: boolean;
}) {
  const data = await shopifyClient.request<CollectionResponse>(
    GET_COLLECTION_BY_HANDLE_QUERY,
    { handle, first, after, sortKey, reverse },
  );
  return data.collection;
}

export async function searchProducts({
  query,
  first = 20,
  after,
}: {
  query: string;
  first?: number;
  after?: string;
}) {
  const data = await shopifyClient.request<ProductsResponse>(
    SEARCH_PRODUCTS_QUERY,
    { query, first, after },
  );
  return data.products;
}

export async function getPage(handle: string) {
  const data = await shopifyClient.request<{ page: any }>(GET_PAGE_QUERY, {
    handle,
  });
  return data.page;
}

export async function getShopId() {
  const query = `{ shop { id } }`;
  const data = await shopifyClient.request<{ shop: { id: string } }>(query);
  const gid = data.shop.id; // gid://shopify/Shop/123456
  return gid.split("/").pop();
}
