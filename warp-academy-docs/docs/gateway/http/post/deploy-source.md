# Deploy contract source endpoint

Method: `POST`

`/gateway/deploy-source` - allows to deploy contract source. Transaction is firstly wrapped in a data item as described in the Arweave standard [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) and then uploaded to Bundlr. Finally, it is indexed in Warp gateway.

Example request:

```ts
await fetch(`https://gateway.warp.cc/gateway/sources/deploy`, {
  method: 'POST',
  body: JSON.stringify(sourceTx),
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
```
