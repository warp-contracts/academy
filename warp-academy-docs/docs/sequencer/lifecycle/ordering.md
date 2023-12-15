# Ordering Interactions

## Sort Key

Interactions are ordered based on a unique key that is assigned to each interaction. 
We will refer to such a key as **sort key**.
The SmartWeave protocol uses the following pair to establish the order:
```
[block_height, sha256(transactionId + blockHash)]
```
Where:
* `block_height` is the height of the Arweave block that contains the interaction.
* The second element of the pair is equal to the `sha256` hash of the concatenated transaction ID and block hash. 
This means that the order of transactions within a block is unpredictable until the block is mined.

The centralized [Warp Sequencer](/docs/sequencer/centralized) introduced an additional element to the sort key. The pair was replaced by a triplet, where the second element is the timestamp at which the sequencer received the interaction. However, for interactions sent directly to Arweave, this second element receives the value `0000000000000`.

For example, for the transaction ID `La_NpAFAWxGj-VIiLfg7NbBfox0RZ8uuEJSOOZykd48`, block hash `o88tFYsMG9RXSGcNXX5sVDuSV5uHy7zuFRj6vYo91e3mXpmng6qw322Ip0-EguA`, block height `1015560`, and sequencer timestamp `1663069424541`, the sort key value for this transaction is:
```
000001015560,1663069424541,a21ac8a60326ba8c2bb8caa05cff3334a22e9960ef55de0b5392caa30b484d0a
```
If the same transaction were to go directly to Arweave, it would have the assigned key:
```
000001015560,0000000000000,a21ac8a60326ba8c2bb8caa05cff3334a22e9960ef55de0b5392caa30b484d0a
```
This solution ensured that interactions were still ordered in the same order as defined by the SmartWeave protocol. At the same time, the centralized sequencer did not have to wait for the interaction to be placed in an Arweave block, and it used the data from the current Arweave block to calculate the sort key.

In a decentralized sequencer, the timestamp of the interaction cannot be taken into account because each node received the interaction at a different time, or some nodes may not have had the interaction in their mempool at all. Therefore, in this solution, the sort key is calculated based on the data from the sequencer block in which the interaction was placed.

The key consists of the following triplet:
```
Arweave block height, Sequencer block height, Interaction index in the Sequencer block
```
Where:
* `Arweave block height` is the height of the last Arweave block that was [fetched](/docs/sequencer/lifecycle/receiving#syncing-with-arweave) by the sequencer and added to the sequencer's blockchain.
* `Sequencer block height` is the height of the block that was agreed upon by the sequencer nodes and that contains the given interaction.
* Interactions in the sequencer block are placed in a list, and each element of the list is assigned an index in the order in which it is placed. 
This index is the third component of the sort key triplet.

For example, if the last block added to the sequencer's chain was an Arweave block with a height of 1322128, and the interaction was placed in a sequencer block with a height of 1322128, being the third interaction in that block, its sort key would have the value:
```
000001322128,0000001322128,00000002
```

Interactions sent directly to Arweave are assigned the same sort key as in the case of a centralized sequencer, following the SmartWeave protocol, but with all zeros in the second position. 
This implies, in particular, that when an Arweave block along with its contained interactions is added to a specific sequencer block, it becomes the first transaction in that block, and the interactions are the first ones to have a sort key with a given Arweave height in the first position.

## Previous Sort Key

----
[DIAGRAM WITH LINKED LIST OF INTERACTIONS]

----

All interactions, regardless of how they were sent, are ordered by the sequencer in a linear order. 
This means that for each interaction, which is not the first interaction of a given contract, we can identify its predecessor within that contract. 
For this purpose, we use a value we will call the `prev sort key`.

This value is useful prior to the evaluation of the contract state when retrieving the [list of interactions](/docs/gateway/http/get/interactions) for that contract from the gateway, ensuring that no interactions were overlooked.

To calculate the prev sort key, each sequencer node maintains a map (refer to: [Data Format](/docs/sequencer/data-format#previous-sort-keys)) in which, for each contract ID, the sort key of the last interaction associated with that contract is stored.

## Block Proposal
As sequencer nodes accept interactions and place them in their mempool, these interactions do not yet have assigned `sort key` and `prev sort key` values. These values can only be calculated at the time of creating a proposal for the next sequencer block.

----
[DIAGRAM FOR PROPOSER]

----

The process is as follows:

1. One of the sequencer nodes is selected as the proposer of the next block. 
This is done according to the [Proposer Selection Procedure](https://docs.cometbft.com/main/spec/consensus/proposer-selection), which is a weighted round-robin algorithm. 
The remaining nodes wait until the selected proposer sends them their proposal or the specified time for this action elapses (in this case, the next proposer is selected).

2. The proposer creates a new block based on its local queue of Arweave blocks and the list of interactions in the local mempool.

3. If the oldest Arweave block in the local queue predates the last sequencer block by 1/2 hour, it is added as the first in the new sequencer block. 
This means that all subsequent interactions will receive a sort key whose first component aligns with the height of this block.

4. Subsequently, interactions from the mempool are added to the sequencer block following their order of placement in the mempool. 
The size of the sequencer block is limited, as defined in the network configuration. 
Hence, if there are many interactions in the mempool, not all may fit into the next block. 
However, in most cases, all interactions are included, and the proposer's mempool is emptied.

5. Once the list of interactions for the block is determined, sort key values are calculated for them. 
All the necessary data for these keys is known, including the height of the new block and the indices of individual interactions. 
Additionally, the proposer calculates the prev sort key value for each interaction (including those in a potentially added Arweave block) and assigns them random values (more on this [below](#random-values)).

6. It is possible that the newly created sequencer block may also include other transactions more related to the network's operation than directly to smart contract functionality.

7. After creating the block proposal, it is signed and sent to the remaining nodes (validators) in the network for verification, followed by a voting process on the proposal.

## Block validation

Once the block proposal is sent to the remaining sequencer nodes, those nodes proceed to validate it.
In addition to the standard checks, such as whether the block has the correct format and is correctly signed, the interactions contained in the block are also validated.
The process unfolds as follows:

1. If the oldest Arweave block in the validator's local queue is older than 1/2 hour from the previous sequencer block, the validator checks whether such a block is added to the beginning of the sequencer block proposal. 
The basic data of the Arweave block and the interactions contained in it are compared between the block proposal and the local queue.

2. Next, the list of interactions added to the block is examined. The correctness of these interactions is validated, specifically checking if they include the correct `Nonce` value and are correctly signed by the sender.

3. During interaction validation, the validator reproduces the process of calculating the sort key, prev sort key, and random value, verifying if the obtained values match those computed by the proposer.

4. If the block has successfully passed the validation process, the validator votes to add the block to the chain. Otherwise, it votes against.

Upon acceptance of the block by the sequencer network, the node must review its mempool and the Arweave block queue. 
Interactions that have been added to the block are removed from the mempool. 
Additionally, the remaining interactions in the mempool are checked for correctness, such as verifying the nonce value. 
From the Arweave block queue, the block is removed if it has been added to the sequencer block.

## Random values

When creating a block proposal, the proposer assigns interactions not only values related to their order but also pseudorandom values. 
These values are utilized by certain contracts, such as those associated with games or lotteries. 
Since state evaluation must be a deterministic process, these values cannot be generated during state computation. 
Otherwise, different [D.R.E.](/docs/dre/overview) nodes might calculate different states.

The following conditions must be met when calculating random values:

1. The value cannot be predicted, especially by users who create the interaction, so it cannot be set by the sender.
2. There should be a way to verify whether the value has not been tampered with.
3. For interactions sent directly to Arweave, this value should be independent of the data computed by the sequencer, providing the opportunity to use smart contracts on Arweave without engaging with the Warp ecosystem.

A solution could be to assign this value by the sequencer in a non-predictable but deterministic way:
```
sha256(Sequencer Block Hash + Sort Key)
```
This entails calculating the `sha256` hash from the concatenation of the sequencer block hash and the sort key. 
This approach satisfies condition 1, as users cannot predict this value until it is included in the relevant block. 
Simultaneously, sequencer nodes have minimal influence on the block hash (detailed analysis [below](#malicious-proposer)), making it straightforward to verify whether they have calculated this value correctly.

For interactions sent directly to Arweave, condition 3 must also be met. Therefore, in this case, the value is equal to:
```
sha256(Sort Key)
```
:::tip
Random values calculated by the sequencer in the form of hashes are available in contract code through the function:
```typescript
SmartWeave.randomNumber(maxValue)
```
which returns a natural number in the range `[1, maxValue]`.
:::

## Malicious Proposer

The sequencer network operates correctly under the assumption that over 2/3 of its nodes are honest.
However, in the context of ordering interactions, this assumption may not be sufficient.
Every active validator occasionally takes on the role of proposer, which has a significant impact on the order of interactions.
The default sequencer implementation assumes that interactions are placed in a block in the order in which they were received.
However, sequencer nodes lack the capability to verify whether the proposer indeed preserves such an order.
The rotational selection of the proposer ensures that the majority of blocks have appropriately ordered interactions, but this falls short of an adequate security level.

The same applies to random values. 
The proposer has minimal influence on the block hash, because it has the ability to decide which votes approving the previous block to add to the current block (it must collect more than 2/3 of the votes).
Consequently, it has very limited control over the random values in the next block.
However, a malicious collaboration between two consecutive proposers would be required.

To address these issues, future versions of the decentralized sequencer will introduce the following developments:
- **Threshold encryption:** To prevent the proposer from seeing which interactions to order, eliminating any incentive for manipulation.
- **More Collective Ordering:** Nodes can send the order of interactions resulting from their mempool together with their votes on a given block, and the proposer will be to a certain extent obliged to follow the order sent by other nodes.
- **Random (or hash-based) Order** can also be considered, as it is currently in the SmartWeave protocol.
- **VDF for Random Numbers:** A verifiable delay function (VDF) will be computed from the block hash. 
The proposer, when creating a block, cannot predict or precompute it due to time constraints.

More details about future sequencer developments can be found on the [roadmap](/docs/sequencer/roadmap).