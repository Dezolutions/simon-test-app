import { ShopifyAdminGraphqlAppInstallationService } from "./app-installation.service"
import { CreateAppDataMetafieldMutation } from "./shopify-admin-graphql-api/mutations/create-app-data-metafield.mutation"
import { GetAppMetafieldQuery } from "./shopify-admin-graphql-api/queries/app-metafield.query"

export class ShopifyAdminGraphqlAppMetafieldsService {

  static async createAppMetafield(graphql,namespace,metafields) {
    const appInstallation = await ShopifyAdminGraphqlAppInstallationService
      .getAppInstallation(graphql)
    if(!appInstallation)
      throw new Error('Failed to fetch current app installation from Shopify Admin API')
    console.log(appInstallation, 'appInstallation')
    const cartFreeProductMetafieldMutationResponse =  await graphql(
      CreateAppDataMetafieldMutation,
      {
        variables: {
          metafieldsSetInput: metafields.map(metafield => ({
            namespace,
            key: metafield.key,
            type: "single_line_text_field",
            value: metafield.value,
            ownerId: appInstallation.id,
          }))
        }
      }
    )
    const { data } = await cartFreeProductMetafieldMutationResponse.json()
    return data?.metafieldsSet
  }

  static async getCartFreeProductAppMetafield(graphql,namespace, key) {
    const cartFreeProductIdQueryResponse = await graphql(
      GetAppMetafieldQuery,
      {
        variables: {
          namespace,
          key,
        }
      }
    )
    const { data } = await cartFreeProductIdQueryResponse.json()
    return data?.currentAppInstallation?.metafield
  }
}