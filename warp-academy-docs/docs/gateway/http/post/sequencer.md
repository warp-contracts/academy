# Sequencer endpoint

Method: `POST`

`/gateway/sequencer/register` - allows to bundle and assign order to interaction transactions. When registering interaction, a sort key is assigned to it (it takes into account sequencer's timestamp, current Arweave network block height and is salted with the sequencer's key). Interaction transaction is then wrapped in a data item which is uploaded to Bundlr. Lastly, it is indexed in Warp gateway.

Example request:

```ts
await fetch(`https://gateway.warp.cc/gateway/sequencer/register`, {
  method: 'POST',
  body: JSON.stringify(interactionTx),
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
```
