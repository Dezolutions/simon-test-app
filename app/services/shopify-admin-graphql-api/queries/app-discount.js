export const GetDiscount = `query getDiscount($id: ID!){
  automaticDiscountNode(id: $id) {
    ... on DiscountAutomaticNode {
      id
    }
  }
}`