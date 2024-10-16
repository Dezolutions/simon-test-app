import { CreateCartFreeProductDiscountMutation } from "./shopify-admin-graphql-api/mutations/create-discount";
import { DeleteDiscountMutation } from "./shopify-admin-graphql-api/mutations/delete-discount";
import { UpdateCartFreeProductDiscountMutation } from "./shopify-admin-graphql-api/mutations/update-discount";
import { GetDiscount } from "./shopify-admin-graphql-api/queries/app-discount";

export class ShopifyAdminGraphqlAppDiscountService {

  static async getDiscount(graphql, discountId) {
    const getDiscountResponse = await graphql(
      GetDiscount,
      {
        variables: {
          id: discountId
        }
      }
    )

    const { data } = await getDiscountResponse.json();
    return data;
  }
  static async createDiscount(graphql,productsBuy, productsGet) {
    const discountResponse = await graphql(
      CreateCartFreeProductDiscountMutation,
      {
        variables: {
          automaticBxgyDiscount: {
            combinesWith: {
              orderDiscounts: true,
              productDiscounts: true,
              shippingDiscounts: true
            },
            customerBuys: {
              items: {
                all: false,
                products: {
                  productsToAdd: productsBuy
                }
              },
              value: {
                quantity: '1'
              }
            },
            customerGets: {
              items: {
                all: false,
                products: {
                  productVariantsToAdd: productsGet
                }
              },
              value: {
                discountOnQuantity: {
                  quantity: '1',
                  effect: {
                    percentage: 1.0
                  }
                }

              }
            },
            title: "Cart Free Product Discount",
            startsAt: new Date().toISOString(),
            usesPerOrderLimit: '50'
          }
        }
      }
    )

    const { data } = await discountResponse.json();
    return data;
  }

  static async updateDiscount(graphql, discountId, productsBuyAdd, productsBuyRemove, productsGetAdd, productsGetRemove) {
    const updatedDiscountResponse = await graphql(
      UpdateCartFreeProductDiscountMutation,
      {
        variables: {
          automaticBxgyDiscount: {
            customerBuys: {
              items: {
                products: {
                  productsToAdd: productsBuyAdd,
                  productsToRemove: productsBuyRemove
                }
              }
            },
            customerGets: {
              items: {
                products: {
                  productVariantsToAdd: productsGetAdd,
                  productVariantsToRemove: productsGetRemove
                }
              }
            }
          },
          id: discountId.toString()
        }
      }
    )

    const { data } = await updatedDiscountResponse.json();
    return data;
  }

  static async deleteDiscount(graphql, discountId) {
    const deletedDiscountResponse = await graphql(
      DeleteDiscountMutation, {
        variables: {
          id: discountId
        }
      }
    )

    const { data } = await deletedDiscountResponse.json();
    return data;
  }
}