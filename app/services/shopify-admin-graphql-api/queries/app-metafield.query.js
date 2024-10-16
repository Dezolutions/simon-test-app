export const GetAppMetafieldQuery = `query getAppMetafield($key: String!, $namespace: String!){
  currentAppInstallation {
    metafield(key: $key, namespace: $namespace) {
      value
    }
  }
}`