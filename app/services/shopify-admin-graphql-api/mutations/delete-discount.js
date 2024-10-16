export const DeleteDiscountMutation = `mutation discountAutomaticDelete($id: ID!) {
  discountAutomaticDelete(id: $id) {
    deletedAutomaticDiscountId
    userErrors {
      field
      code
      message
    }
  }
}`