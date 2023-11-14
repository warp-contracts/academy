# Register contract endpoint

Method: `POST`

`/gateway/register` - allows to register contract in Warp gateway. Contract must be firstly uploaded to Irys or other provider (e.g. Turbo or through arbundles). Then its id and register provider (either `node1` or `node2` for Irys deployments or `arweave` for others) must be passed to the request. Contract is then indexed in Warp gateway.

Example request:

```ts
await fetch(`https://gateway.warp.cc/gateway/contracts/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({ contractId, registerProvider }),
});
```
