import { GetProductsQuery } from "./shopify-admin-graphql-api/queries/app-products";

export class ShopifyAdminGraphqlAppProductsService {

  static async getProducts(graphql) {
    const getProductsResponse = await graphql(GetProductsQuery);

    const { data } = await getProductsResponse.json()

    return data;
  }
}