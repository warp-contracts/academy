# Deploy contract endpoint

Method: `POST`

`/gateway/deploy-contract` - allows to deploy contract or contract with contract source. Transaction is firstly wrapped in a data item as described in the Arweave standard [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) and then uploaded to Bundlr. Finally, it is indexed in Warp gateway.

Example request:

```ts
const body = {
  contractTx,
  sourceTx,
};

await fetch(`https://gateway.warp.cc/gateway/contracts/deploy`, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
```
