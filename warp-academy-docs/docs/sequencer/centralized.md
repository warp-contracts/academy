# Warp Centralized Sequencer

:::caution
This section describes the operation of the current centralized sequencer, which will soon be replaced by the new [decentralized solution](/docs/sequencer/decentralized).
:::

## How it works

Instead of posting the interaction transactions directly to Arweave mainnet, Warp SDK creates a data item with interaction input and tags which is then signed with user's wallet. Data item is then sent to Warp Sequencer (`/gateway/v2/sequencer/register` endpoint) (this is the default behaviour of Warp's SDK `contract.writeInteraction`
function, when `forMainnet` instance is being used).

The Warp Sequencer then:

#### 1. Generates a sort key

A sort key is generated from:

1. current mainnet network height
2. current sequence value
3. original transaction id
4. current mainnet block hash

In the original SmartWeave protocol specification, a _sort key_ is defined
as a `[ block_height,sha256(transactionId + blockHash) ]`, where:

1. `block_height` - current network height, l-padded with `0` to 12 chars, e.g. for block height `1015556`, the
   result is `000001015556`
2. `sha256(transactionId + blockHash)` - a `sha256` hash of the concatenated buffers of the transaction id and block
   hash,
   e.g. for txId `UR_35HORbjjZ_NnUqinkZuWkcNB1-gBST3Rezt5JrDs` and block
   hash `ixWCxRN36DjVUxQRa68xIeoZLfvLDTtX78e0ae8RAAJjOPpDBuVKVaEKYOpq7bLS`,
   the result is `44edd70f2018924f22a878a558a8f2d5cae8bc1f718d567df43bf52b6384d260`.

The complete _sort key_ for the above values would
be: `000001015556,44edd70f2018924f22a878a558a8f2d5cae8bc1f718d567df43bf52b6384d260`.

The generated sort keys are then used by the SmartWeave protocol to lexicographically sort the transactions.

The Warp Sequencer extends this default mechanism by the current sequence value.  
The formula for the _sort key_ is extended to:
`[ block_height,sequence_value,sha256(transactionId + blockHash) ]`

This sequence value can be obtained from the Sequencer's node timestamp, database or other sources.
In its current implementation - a Sequencer node timestamp value is being used.  
This in effect gives a fair transactions ordering - the transactions will have the sequence assigned in order in which
they are processed by the Sequencer.

Assuming transaction id `La_NpAFAWxGj-VIiLfg7NbBfox0RZ8uuEJSOOZykd48`, block
hash `-o88tFYsMG9RXSGcNXX5sVDuSV5uHy7zuFRj6vYo91e3mXpmng6qw322Ip0-EguA`,
block height `1015560` and current Sequencer value `1663069424541`, the generated _sort key_ would
be `000001015560,1663069424541,a21ac8a60326ba8c2bb8caa05cff3334a22e9960ef55de0b5392caa30b484d0a`

**NOTE** All the transactions sent to Arweave directly, have the sequence value assigned to `0000000000000000`.
This effectively means that if transactions to a given contract are sent both directly to Arweave mainnet and Warp
Sequencer -
if two transactions happen to be at the same block height, the "direct" Arweave transactions take precedence.
This also means that the sequencing algorithm is fully backwards compatible with the original SmartWeave protocol.

#### 2. Generates tags for the Bundlr transaction

| Tag Name                                    | Tag Value                                                            |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `Sequencer`                                 | `Warp`                                                               |
| `Sequencer-Owner`                           | The original owner/signar of the contract transaction                |
| `Sequencer-Mills`                           | The sequence value used by the Sequencer for this transaction        |
| `Sequencer-Sort-Key`                        | The generated sort key for this transaction                          |
| `Sequencer-Prev-Sort-Key`                   | The sort key of the previous transaction                             |
| `Sequencer-Tx-Id`                           | The original transaction id                                          |
| `Sequencer-Block-Height`                    | The block height used for generating the sort key                    |
| `Sequencer-Block-Id`                        | The block hash used for generating the sort key                      |
| `Sequencer-Block-Timestamp`                 | The timestamp of the block that was used for generating the sort key |
| ...all the tags of the original transaction |                                                                      |

:::tip
The `Sequencer-Prev-Sort-Key` tells what is the sort key of the 'previous' transaction in the sequencer and
can be used to verify whether all transactions have been properly loaded (i.e. if one
decides to load them directly from L1 nodes) and none is missing.
:::

Additional set of tags are added in case user requests generating a random value using VRF (Verifiable Random Function):

| Tag Name     | Tag Value                                                               |
| ------------ | ----------------------------------------------------------------------- |
| `vrf-index`  | The original hash generated by the VRF (using `sort_key` as input data) |
| `vrf-proof`  | The original proof generated by the VRF                                 |
| `vrf-bigint` | A BigInt value evaluated from the hash generated by the VRF             |
| `vrf-pubkey` | The public key used by the VRF                                          |

Verifiable randomness can be used by contracts that require using random values - e.g. gaming contracts, nft/loot
generating contracts, etc.
Using the `sort_key`, `vrf-proof` and `vrf-pubkey`, the client can always verify the generated random value.

#### 3. Wrap original data item in a bundle and uploads the bundle to Bundlr

Apart from all the tags from point 2, some additional tags are added to the wrapping bundle:

| Tag Name         | Tag Value         |
| ---------------- | ----------------- |
| `Bundle-Format`  | `binary`          |
| `Bundle-Version` | `2.0.0`           |
| `App-Name`       | `Warp`            |
| `Action`         | `WarpInteraction` |

In order to send original data item to Bundlr, we use the concept of nested bundles and set an interaction data item inside a bundle. If you're not faimiliar with this concept, here is a quick summary:

:::info
Bundling allows to write multiple data items into one top level transaction. A data item differs from a regular transaction by not allowing to transfer AR tokens and passing reward but it has most of the transaction's properties - such as owner, data, tags, owner and id.

In a nutshell, the nested bundles concept means that a data item of a bundle can also be a bundle containg other data items. According to ANS-104 standard it can lead to theoretically unbounded levels of nesting.

You can read the specification for nested bundles standard in [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md#31-nested-bundle).
:::

:::info
Obviously the data-item is signed by the Sequencer's wallet - and as such can be easily verified.
The Sequencer wallet address is `jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M`.
:::

**NOTE** The original data item is not modified in any way - this is to preserve the original
signature!

After receiving proper response and receipt from Bundlr, the Warp gateway indexes the contract interaction
internally - to make it instantly available.

#### 4. Finally, the Warp gateway returns the response from the Bundlr to the client.

## Interaction data item retrieval (generated by the Warp Sequencer) via Arweave gateway

Use the GQL endpoint, with the original data item id passed in the `Contract` tag. Note that all the
interactions will be part of a bundle (i.e. will have the `edges.node.bundledIn.id` value set).

```qql
query {
  transactions(
    ids: ["1UIhK4vL5lc2X4aMsJFmMpJqfdgrjznVzi2F17yLBlc"]
  ) {
    edges {
      node {
          id
          tags {
            name
            value
          }
          block {
            height
          }
          bundledIn {
            id
          }
        }
    }
  }
}
```

## Interaction retrieval via Warp gateway

The Warp `/gateway/interactions/:id` endpoint allows to retrieve the interaction info based on its original id.