import { GraphQLClient } from "graphql-request";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

const endpoint = `https://${domain}/api/2024-04/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken as string,
    "Content-Type": "application/json",
  },
  fetch: (url, options) => fetch(url, { ...options, cache: "no-store", next: { revalidate: 0 } }),
});

export const GET_PRODUCTS_QUERY = `
  query getProducts {
    products(first: 8) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
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
      node: ShopifyProduct;
    }[];
  };
}
