# Warp Sequencer

The **Warp Sequencer** serves as a crucial module responsible for submitting users' transactions to the Arweave blockchain. Throughout this process, transactions undergo indexing in the [Warp Gateway](/docs/gateway/overview), ensuring their immediate availability for subsequent operations, such as state evaluation. This stands in contrast to traditional processing, where users typically experience delays of several minutes for transaction mining and confirmation.

The primary aim of the Warp Sequencer is to enhance both Developer and User Experiences. Normally, when an interaction with a contract is being sent to Arweave, a waiting period ensues:

1. **Transaction Mining (~2 minutes):** The time required for the transaction to be mined.
2. **Transaction Confirmation (~20 minutes, assuming at least 10 blocks):** The duration for the transaction to receive proper confirmation.

This cumulative waiting time amounts to approximately 20-25 minutes, presenting challenges:

1. **Disruption to Developer Experience (DX):** For instance, developers seeking to rapidly test contract functions on the mainnet face significant delays.
2. **Impact on User Experience (UX):** Users engaging with a dApp/protocol must endure prolonged waits to witness the outcomes of their interactions with a contract. This renders applications effectively unusable, particularly for users accustomed to the efficiency of web2 applications.

The Warp Sequencer addresses these issues, introducing a more streamlined and efficient process for Arweave transactions, ultimately optimizing both developer workflows and user interactions.

:::note
The significance of waiting for proper confirmation cannot be overstated, particularly in the context of smart contract interactions.
Consider a scenario where a cache, that is evaluating the contracts state for all the interactions returned at any given time by the
default Arweave (arweave.net) gateway.  
If the cache does not wait for the proper transactions' confirmation, there is a risk of storing a contract state that has been evaluated from transactions within forked blocks. Even more concerning is the possibility of storing state data from transactions that were never included in any block.
:::

## Ordering Interactions

As the name implies, the primary function of the sequencer is to arrange incoming interactions in a sequence, establishing a linear order for them. The [Smartweave](/docs/sdk/advanced/smartweave-protocol) protocol determines the order of interactions based on the transaction ID and the Arweave block hash. However, information about the block in which a particular interaction is located and its corresponding hash becomes available only when the interaction is successfully recorded on the Arweave. Nonetheless, in accordance with the aforementioned rationale, waiting for this extended duration is undesirable.

The order of interactions directly affects the contract state calculation process. To reconcile the need for order and the imperative for swift processing, the sequencer assigns an order to interactions shortly after receiving them from the client. Subsequently, the [Warp Gateway](/docs/gateway/overview) returns interactions for a given contract in the sequence dictated by the sequencer, enabling the computation of the contract state. This approach balances the necessity for order and the need for efficient interaction processing.

:::info
For more information, refer to the [ordering](/docs/sequencer/lifecycle/ordering) phase of the interaction lifecycle.
:::

## Final Destination on Arweave

Another pivotal functionality of the sequencer is to transmit interactions to the [Turbo](https://ardrive.io/turbo/infographic/), responsible for ensuring their finality by delivering them to Arweave.

In the realm of blockchain integrity, Arweave serves as a foundational layer that provides an immutable and tamper-resistant record of interactions. This inherent characteristic ensures the long-term integrity and reliability of the entire system. Arweave offers a permanent storage solution, making it well-suited for the enduring preservation of interactions.

This means that even in the case of potential unavailability of Warp infrastructure, interactions remain accessible. This resilience is possible as interactions can be retrieved directly from Arweave, providing a fail-safe mechanism for continued accessibility even during infrastructure disruptions.

:::info
For more information, see the [relaying](/docs/sequencer/lifecycle/ordering) phase of the interaction lifecycle.
:::

## Decentralization

The currently running sequencer is centralized, offering advantages in terms of simplicity and efficiency. However, this solution falls short of the requisite conditions expected in a decentralized ecosystem. The ability to determine the order of interactions profoundly influences the state of contracts, and we would not want to leave such authority in a single entity's hands. Such decisions should be made collectively. 

Therefore, the current sequencer will soon be replaced by a decentralized network of sequencers that will reach a consensus on the order of interactions. This transition is driven by our commitment to cultivating a truly decentralized environment that aligns with the principles of transparency, security, and community consensus. The forthcoming decentralized sequencer network aims to enhance the robustness and trustworthiness of the system, fostering a collaborative approach to transaction sequencing.

The current centralized version will be described in detail in the next section, but the remainder of this chapter will focus on the new decentralized solution.
