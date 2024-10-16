export const GetProductsQuery = `query getProducts {
  products(first: 250) {
    edges {
      node {
        id
        title
        variants(first: 1) {
          edges {
            node{
              id
            }
          }
        }
      }
    }
  }
}`