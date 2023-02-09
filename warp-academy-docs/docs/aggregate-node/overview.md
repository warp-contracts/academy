# Warp Aggregate Node

## How it works

A node that is responsible for aggregating data from D.R.E. nodes and from
interaction transactions.\
The aggregate node is listening for contracts' state updates (published by the
D.R.E. nodes) and aggregates data about PST balances.

The aggregate node also listens for contracts' interactions (published by the
Warp Gateway) and indexes them by values specified in the `Indexed-By` tag.

## Endpoints

### `/all-states`

Returns a list of all the latest states currently held by the
aggregate node.    

Example:
https://contracts.warp.cc/all-states?orderBy=sort_key&order=desc&limit=5

### `/balances`
Returns a list of all balances held by a given `walletAddress`.  

Example:
https://contracts.warp.cc/balances?walletAddress=C6nBlkd7pKRxPiUk1AaGeCrup7XiVQow40NO6c9RDGg

### `/interactions-by-indexes`
Returns a list of interactions associated with given indexes.

To associate interaction with indexes you have to provide a tag with the name
`Indexed-By`, where values are indexes (up to 5 possible). Example with
warp-sdk:

   ```javascript
   const interaction = await this.contract.writeInteraction(
    {function: "like", postId}),
  {tags: [{name: "Indexed-By", value: `project-a;${postId}` }]},
  );
   ```

Params:

- `indexes` - list of indexes that interaction is associated with. Indexes
  are divided by `;`. If you pass more than one index, interactions have to
  have ALL passed indexes (AND).
- `contractTxId` (optional)
- `ownerAddress` (optional) - the owner of the interaction
- `limit` (optional) - how many records should we fetch at one request
- `page` (optional) - number of page

Example request:

`https://contracts.warp.cc/interactions-by-indexes?indexes=project-a;0x0120-0x04`

Response (interactions are ordered by `block_height` in descending order):

   ```json
   {
  "interactions": [
    {
      "block_height": 1108760,
      "contract_tx_id": "ghCNSciu61vISHGV4XfgLoBkLfdm_qewKhVgAEg_pOs",
      "id": "XW5dWJ68ykzedQ-_komt3Pl5eQXWEQrgAyYVMcsGP7c",
      "owner_address": "0x64587b293e4811F4e2588A971D5dB2a11E6D2E4F",
      "tag_index_0": "project-a",
      "tag_index_1": "0x0120-0x04",
      "tag_index_2": null,
      "tag_index_3": null,
      "tag_index_4": null
    }
  ],
  "paging": {
    "items": 1,
    "limit": 1000,
    "page": 1
  }
   ```

### `/nft-by-owner`
Returns a list of nft owned by given `ownerAddress`.  
The contract is treated as `NFT` if deployment transaction contains
`Indexed-By: atomic-asset` tag. `atomic-asset` is standard for NFT, more about
it [here] (description coming soon).

Params:

- `ownerAddress` - potential owner of NFTs

Example request:

`https://contracts.warp.cc/nft-by-owner?ownerAddress=0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

Response:

```json
{
  "paging": {
    "limit": 100,
    "items": 1,
    "page": 1
  },
  "contracts": [
    {
      "contract_tx_id": "5ljTyKaUNtAoohIZ3VHa_HtX-QusuAFlMc89ZTHgi1U",
      "state": "{\"name\":\"mike-test-nft\",\"owner\":\"0x70997970C51812dc3A010C7d01b50e0d17dc79C8\",\"symbol\":\"mike__236\",\"decimals\":0,\"totalSupply\":1,\"balances\":{\"0x70997970C51812dc3A010C7d01b50e0d17dc79C8\":1},\"allowances\":{}}"
    }
  ]
}
```
