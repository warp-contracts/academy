# Deploy bundled contract endpoint

Method: `POST`

`/gateway/deploy-bundled` - allows to deploy contract which has been created as data item using [`arbundles` library](https://github.com/Bundlr-Network/arbundles). Data item needs to be posted in a raw (Buffer) form. 

Example request:

```ts
await fetch(`${WARP_GW_URL}/gateway/contracts/deploy-bundled`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream',
    Accept: 'application/json',
  },
  body: rawDataItem,
});
```
