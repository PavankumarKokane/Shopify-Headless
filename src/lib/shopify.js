import { GraphQLClient } from "graphql-request";

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env
  .VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const endpoint = `https://${domain}/api/2024-04/graphql.json`;

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    "Content-Type": "application/json",
  },
});

// Get featured products for homepage
export async function getFeaturedProducts() {
  const query = `
    {
      products(first: 12) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
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

  const response = await graphQLClient.request(query);
  return response.products.edges.map((edge) => edge.node);
}

// Get collections
export async function getCollections() {
  let collections = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const query = `
      query getCollections($cursor: String) {
        collections(first: 50, after: $cursor) {
          edges {
            node {
              id
              title
              handle
              image {
                url
                altText
              }
              products(first: 1) {
                nodes {
                  id
                  featuredImage {
                    url
                    altText
                  }
                  handle
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const variables = { cursor };

    const response = await graphQLClient.request(query, variables);

    const newCollections = response.collections.edges.map((edge) => edge.node);
    collections = [...collections, ...newCollections];

    hasNextPage = response.collections.pageInfo.hasNextPage;
    cursor = response.collections.pageInfo.endCursor;
  }

  return collections;
}

// Get products by collection
export async function getProductsByCollection(collectionHandle) {
  let products = [];
  let hasNextPage = true;
  let cursor = null;
  let response;

  while (hasNextPage) {
    const query = `
      query getProductsByCollection($handle: String!, $cursor: String) {
        collection(handle: $handle) {
          title
          products(first: 50, after: $cursor) {
            edges {
              node {
                id
                title
                handle
                description
                priceRange {
                  minVariantPrice {
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
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const variables = {
      handle: collectionHandle,
      cursor: cursor,
    };

    response = await graphQLClient.request(query, variables);

    const newProducts = response.collection.products.edges.map(
      (edge) => edge.node
    );
    products = [...products, ...newProducts];

    hasNextPage = response.collection.products.pageInfo.hasNextPage;
    cursor = response.collection.products.pageInfo.endCursor;
  }

  return {
    title: response.collection.title,
    products,
  };
}

// Get product details
export async function getProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        productType
        options {
          id
          name
          values
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        metafields(identifiers: [{key: "gender", namespace: "custom"},{key: "age_group", namespace: "custom"},{key: "brand", namespace: "custom"},{key: "product_care", namespace: "custom"},{key: "product_details", namespace: "custom"}]) {
          value
          key
        }
      }
    }
  `;

  const variables = {
    handle,
  };

  const response = await graphQLClient.request(query, variables);
  return response.product;
}

// Create checkout
export async function createCheckout(variantId, quantity) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 5) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: [{ variantId, quantity }],
    },
  };

  const response = await graphQLClient.request(query, variables);
  return response.checkoutCreate.checkout;
}

// Update checkout
export async function updateCheckout(checkoutId, lineItems) {
  const query = `
    mutation checkoutLineItemsReplace($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          lineItems(first: 25) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    handle
                  }
                }
              }
            }
          }
          totalPrice {
            amount
            currencyCode
          }
        }
        userErrors {
          message
          field
        }
      }
    }
  `;

  const variables = {
    checkoutId,
    lineItems,
  };

  const response = await graphQLClient.request(query, variables);
  return response.checkoutLineItemsReplace.checkout;
}
