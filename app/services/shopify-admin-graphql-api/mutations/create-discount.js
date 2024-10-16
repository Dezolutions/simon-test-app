export const CreateCartFreeProductDiscountMutation = `mutation discountAutomaticBxgyCreate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
  discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
    automaticDiscountNode {
      id
    }
    userErrors {
      field
      message
    }
  }
}`