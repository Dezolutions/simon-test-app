import { useEffect, useState } from "react";
import { defer, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import {
  Page,
  Layout,
  Select,
  Card,
  Button,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { ShopifyAdminGraphqlAppMetafieldsService} from '../services//app-metafields.service'
import { SHOPIFY_CART_FREE_PRODUCT_APP_DISCOUNT_CODE_METAFIELD_KEY, SHOPIFY_CART_FREE_PRODUCT_APP_FIRST_PRODUCT_METAFIELD_KEY, SHOPIFY_CART_FREE_PRODUCT_APP_FREE_PRODUCT_METAFIELD_KEY, SHOPIFY_CART_FREE_PRODUCT_APP_METAFIELDS_NAMESPACE, SHOPIFY_CART_FREE_PRODUCT_APP_SECOND_PRODUCT_METAFIELD_KEY } from "../constants";
import { ShopifyAdminGraphqlAppProductsService } from "../services/app-product.service";
import { ShopifyAdminGraphqlAppDiscountService } from "../services/app-discount.service";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const { admin } = await authenticate.admin(request);

  //Getting products
  const productsResponse = await ShopifyAdminGraphqlAppProductsService.getProducts(admin.graphql);

  const products = productsResponse.products.edges.map(({ node }) => ({
    label: node.title,
    value: node.id,
  }));
  const productVariants = productsResponse.products.edges;

  //Getting all app metafields
  const firstProductMetafieldResponse = await ShopifyAdminGraphqlAppMetafieldsService
    .getCartFreeProductAppMetafield(admin.graphql,SHOPIFY_CART_FREE_PRODUCT_APP_METAFIELDS_NAMESPACE, SHOPIFY_CART_FREE_PRODUCT_APP_FIRST_PRODUCT_METAFIELD_KEY)
  const secondProductMetafieldResponse = await ShopifyAdminGraphqlAppMetafieldsService
    .getCartFreeProductAppMetafield(admin.graphql,SHOPIFY_CART_FREE_PRODUCT_APP_METAFIELDS_NAMESPACE, SHOPIFY_CART_FREE_PRODUCT_APP_SECOND_PRODUCT_METAFIELD_KEY)
  const freeProductMetafieldResponse = await ShopifyAdminGraphqlAppMetafieldsService
    .getCartFreeProductAppMetafield(admin.graphql,SHOPIFY_CART_FREE_PRODUCT_APP_METAFIELDS_NAMESPACE, SHOPIFY_CART_FREE_PRODUCT_APP_FREE_PRODUCT_METAFIELD_KEY)
  return defer({ products, productVariants, firstProductMetafieldResponse, secondProductMetafieldResponse, freeProductMetafieldResponse });
};

export const action = async ({ request }) => {

  //Form data
  const formData = await request.formData();
  const product1 = formData.get("product1");
  const product2 = formData.get("product2");
  const freeProduct = formData.get("freeProduct");

  // Admin API to store product IDs in metafields
  const { admin } = await authenticate.admin(request);

  //Discount operations
  const discountCodeMetafieldResponse = await ShopifyAdminGraphqlAppMetafieldsService
    .getCartFreeProductAppMetafield(admin.graphql, SHOPIFY_CART_FREE_PRODUCT_APP_METAFIELDS_NAMESPACE, SHOPIFY_CART_FREE_PRODUCT_APP_DISCOUNT_CODE_METAFIELD_KEY);

  //Getting discount for delete operation
  let discountCodeResponse = {};
  if(discountCodeMetafieldResponse?.value) {
    discountCodeResponse = await ShopifyAdminGraphqlAppDiscountService
      .getDiscount(admin.graphql, discountCodeMetafieldResponse.value);
  }

  console.log(discountCodeResponse, 'AADDDD')
  //Deleting discount if it exist
  let deletedDiscountResponse = '';
  if(discountCodeResponse?.automaticDiscountNode.id) {
    deletedDiscountResponse = await ShopifyAdminGraphqlAppDiscountService
      .deleteDiscount(admin.graphql, discountCodeResponse.automaticDiscountNode.id);
  }

  //Creating new discount
  const discountResponse = await ShopifyAdminGraphqlAppDiscountService
    .createDiscount(admin.graphql, [product1, product2], [freeProduct.split('&')[1]]);

  
  console.log(discountCodeResponse, 'DISCOUNT RESPONSE')
  console.log(discountResponse, 'DISCOUNT CREATE RESPONSE')
  console.dir(discountResponse, { depth: 10 })
  //Creating or updating App metafields
  const metafieldResponse = await ShopifyAdminGraphqlAppMetafieldsService
    .createAppMetafield(admin.graphql,SHOPIFY_CART_FREE_PRODUCT_APP_METAFIELDS_NAMESPACE, [
      {
        key: SHOPIFY_CART_FREE_PRODUCT_APP_FIRST_PRODUCT_METAFIELD_KEY,
        value: product1
      },
      {
        key: SHOPIFY_CART_FREE_PRODUCT_APP_SECOND_PRODUCT_METAFIELD_KEY,
        value: product2
      },
      {
        key: SHOPIFY_CART_FREE_PRODUCT_APP_FREE_PRODUCT_METAFIELD_KEY,
        value: freeProduct
      },
      {
        key: SHOPIFY_CART_FREE_PRODUCT_APP_DISCOUNT_CODE_METAFIELD_KEY,
        value: discountResponse?.discountAutomaticBxgyCreate?.automaticDiscountNode?.id
      }
    ]);

    console.log(metafieldResponse, 'METAFIELD RESPONSE')
  return json({ success: true, metafields: metafieldResponse });
};

export default function Index() {

  //loaders & fetchers
  const fetcher = useFetcher();
  const  {products, productVariants, firstProductMetafieldResponse, secondProductMetafieldResponse, freeProductMetafieldResponse} = useLoaderData();

  //States
  const [product1, setProduct1] = useState(firstProductMetafieldResponse?.value || '');
  const [product2, setProduct2] = useState(secondProductMetafieldResponse?.value|| '');
  const [freeProduct, setFreeProduct] = useState(freeProductMetafieldResponse?.value.split('&')[0]|| '');
  const [freeProductVariant, setFreeProductVariant] = useState();

  //Getting free product variant for cart operation
  useEffect(() => {
    const productVariant = productVariants.find(variant => variant.node.id === freeProduct)
    setFreeProductVariant(productVariant?.node.variants.edges[0]?.node.id)
  },[freeProduct])

  //Submitting form
  const handleSave = () => {
    const formData = new FormData();
    formData.append("product1", product1 || "");
    formData.append("product2", product2 || "");
    formData.append("freeProduct", `${freeProduct}&${freeProductVariant}` || "");

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <Page title="Configure Cart Rule">
      <TitleBar title="Configure Cart Rule" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Select
                    label="Tracked Product 1"
                    options={products}
                    onChange={setProduct1}
                    value={product1}
                    placeholder="Select first product"
                  />
                  <Select
                    label="Tracked Product 2"
                    options={products}
                    onChange={setProduct2}
                    value={product2}
                    placeholder="Select second product"
                  />
                  <Select
                    label="Free Product"
                    options={products}
                    onChange={setFreeProduct}
                    value={freeProduct}
                    placeholder="Select free product"
                  />
                </BlockStack>

                <Button onClick={handleSave}>Save Configuration</Button>

                {fetcher.data?.success && <p>Configuration saved successfully!</p>}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

