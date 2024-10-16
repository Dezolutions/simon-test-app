import { GetCurrentAppInstallationQuery } from "./shopify-admin-graphql-api/queries/app-installation.query";

export class ShopifyAdminGraphqlAppInstallationService {
  static async getAppInstallation(graphql) {
    const appQueryResponse = await graphql(GetCurrentAppInstallationQuery)
    const { data } = await appQueryResponse.json()
    return data?.currentAppInstallation;
  }
}