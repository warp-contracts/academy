# Receiving and Validating Interactions

The sequencer accepts interactions in the form of [DataItem](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) via the endpoint `/api/v1/data-item` (refer to: [API Methods](/docs/sequencer/api-methods#submits-a-new-interaction-to-the-sequencer)). 
Interactions added to the sequencer's blockchain take the form of messages. 
The message that encapsulates an interaction in the DataItem format is `MsgDataItem` (see: [Messages format](/docs/sequencer/data-format#interaction-message)). 
Consequently, upon receiving an interaction, a sequencer node generates a message of type `MsgDataItem` based on the received interaction.
Finally, a transaction is created whose only message is this interaction.

:::tip
A [transaction](https://docs.cosmos.network/main/learn/advanced/transactions) in the Cosmos SDK represents a set of messages that trigger state transitions within the blockchain.
:::

----
[DIAGRAM FOR RECEIVING INTERACTIONS]

----

## Validation

Subsequently, the transaction undergoes a validation process to ensure its correctness. 
The validation of the interaction encompasses the following checks:

* The interaction has the correct format (according to the [standard](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md#21-verifying-a-dataitem)).
* The interaction has the correct tags (according to the [SmartWeave](/docs/sdk/advanced/smartweave-protocol#contract-interactions) protocol).
* It has a tag with the correct Nonce value.
* The interaction is correctly signed.

In addition to validating the interaction itself, the transaction is also validated if it was created by another sequencer node.
In this scenario, the following checks are performed:

* The transaction contains exactly one message containing the interaction.
* No additional fields are set (`Memo`, `TimeoutHeight`, etc.).
* The public key of the transaction signature belongs to the owner of the interaction.

In addition to the checks mentioned above, the sequencer also creates an account for the sender of the interaction (if it does not exist yet) and updates the `Nonce` value for that account.

Once the transaction successfully completes the validation process, it is broadcasted to the remaining nodes in the network and added to the mempool for further processing.

## Mempool

The mempool, short for memory pool, in sequencer networks serves as a temporary storage area for interactions that have been broadcasted to the sequencer but have not yet been included in a block. 
It functions as a dynamic buffer, holding unconfirmed transactions until they are selected for inclusion in a future block during the consensus process. 
The mempool plays a crucial role in maintaining transaction flow, ensuring the synchronization of nodes within the network, allowing for efficient transaction management and reducing potential bottlenecks in the processing pipeline. 
The mempool's transient nature ensures that only valid and properly formatted transactions proceed to be included in the blockchain, promoting the integrity of the sequencer network.

The order of interactions within the mempool follows the "First-Come-First-Served" (FCFS) principle. 
This means that interactions are processed and included in the mempool in the order in which they are received by the node. 
FCFS ensures a fair and straightforward queuing mechanism, where interactions are handled based on their arrival time, contributing to a transparent and predictable processing flow.

:::info
The mempool has a maximum size. 
When the mempool is full, the sequencer will stop accepting new interactions until the mempool has been cleared. 
This is done to prevent the mempool from becoming too large and to ensure that the sequencer can process interactions in a timely manner.
:::

## Syncing with Arweave

In addition to receiving interactions from the SDK, sequencers also download interactions that have been directly submitted to Arweave.
To achieve this, each sequencer node periodically queries Arweave for the latest blocks, following a specific algorithm:

* Several Arweave peers are queried simultaneously.
* A block is processed further if the majority of peers return the same block.
* Blocks are also validated for an extra layer of security.
* Blocks whose height is less than the current network height by 10 are downloaded. This is to prevent forks.
* For each retrieved block, interactions related to the SmartWeave protocol are extracted.
* The downloaded block, along with its interactions, is appended to the local Arweave block queue, where it awaits inclusion in the sequencer's blockchain.

The sequencer selectively stores only the essential information required for establishing the linear order of interactions, rather than duplicating data readily available in Arweave. 
For Arweave blocks, the sequencer retains the necessary data such as height, timestamp, and block hash (and specifically the value of [indep_hash](https://docs.arweave.org/developers/arweave-node-server/http-api#block-format)). 
Regarding interactions, it focuses on the interaction ID and contract ID. 
This streamlined data storage approach ensures that the sequencer maintains the required details for sequencing without unnecessary duplication of data already present in Arweave.

### Arweave as an External Data Source

From the perspective of the sequencer network, Arweave is an external data source. 
This means that it can be considered a source of non-determinism, which can prevent sequencer nodes from reaching consensus. 
This is extremely important, as it can lead to inconsistency between nodes and the network coming to a halt.

Therefore, it is important to ensure that the Arweave block download mechanism is as secure as possible. 
This is why the following safeguards are in place:
* **Height-Based Block Selection:** 
Only blocks that are less than 10 blocks behind the current height are downloaded. 
This helps to prevent the situation where different sequencer nodes download different blocks as a result of a fork.

* **Timestamp Synchronization:** 
Downloaded Arweave blocks are held in the local queue until their timestamp is at least half an hour earlier than the timestamp of the current sequencer block.
This time window allows sequencer nodes to accommodate potential delays or reattempt block retrieval in case of network issues.

* **Consistency Retry Mechanism:**
If 10 consecutive attempts to achieve consensus fail due to inconsistencies in Arweave blocks, local queues of these blocks are cleared. 
Nodes then initiate a fresh attempt to retrieve Arweave blocks.
