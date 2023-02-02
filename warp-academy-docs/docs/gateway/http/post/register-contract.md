# Register contract endpoint

Method: `POST`

`/gateway/register` - allows to register contract in Warp gateway. Contract must be firstly uploaded to Bundlr, its id and Bundlr's node to which contract data item has been uploaded (either `node1` or `node2`) must be passed to the request. Contract is then indexed in Warp gateway.

Example request:

```ts
await fetch(`https://gateway.warp.cc/gateway/contracts/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({ contractId, bundlrNode }),
});
```
