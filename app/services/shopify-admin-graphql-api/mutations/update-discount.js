export const UpdateCartFreeProductDiscountMutation = `mutation discountAutomaticBxgyUpdate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!, $id: ID!) {
  discountAutomaticBxgyUpdate(automaticBxgyDiscount: $automaticBxgyDiscount, id: $id) {
    automaticDiscountNode {
      id
    }
    userErrors {
      field
      message
    }
  }
}`