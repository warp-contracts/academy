# Warp Decentralized Sequencer

In contrast to the current [centralized sequencer](/docs/sequencer/centralized), our upcoming [decentralized sequencer](https://github.com/warp-contracts/sequencer) solution 
marks a significant evolution in our approach to interaction sequencing within the Arweave ecosystem. 
Embracing the principles of decentralization, transparency, and community consensus, this innovative system aims 
to distribute the responsibility of determining the order of interactions across a network of sequencers.

## Criteria

The selection of a new sequencer solution was guided by several crucial criteria, ensuring a robust and efficient system. These standards include:

#### Decentralization
The transition to a decentralized model is essential to foster transparency and accountability. 
Rather than relying on a single entity, the ordering of transactions should be distributed among multiple nodes. 
This decentralization eliminates a single point of control (i.e. the Warp team) and enhances the overall resilience of the system.
#### Security
Security is of paramount importance when decentralizing the sequencer. 
By distributing the interaction processing across a network of nodes, the risk of a single point of failure is significantly reduced. 
The design must prioritize the implementation of robust security measures to protect against potential attacks.
#### Performance
Ensuring low latency is crucial to enable swift and efficient interaction processing. 
The Warp sequencer benefits from not burdening itself with contract state evaluation, simplifying the performance requirements.
However, a timely confirmation process remains a top priority when designing the solution to maintain a seamless user experience.
#### Simplicity
While decentralization introduces complexity, it is essential to strive for simplicity in the final solution. 
A streamlined approach minimizes implementation time, mitigates technical risks, and enhances stability. 
Furthermore, a simpler system is easier to maintain and less prone to vulnerabilities, ensuring a reliable and secure environment.

## Functionality
The functionalities provided by the sequencer can be categorized into the following areas:

#### Receiving Interactions

Applications that rely on the [SmartWeave Protocol](/docs/sdk/advanced/smartweave-protocol) to provide smart contract functionality use the [Warp SDK](/docs/sdk/overview). 
The SDK allows for deploying contracts and reading their state, as well as creating and sending interactions with a contract. 
The latter functionality requires a sequencer, which [receives and validates](/docs/sequencer/lifecycle/receiving) the signed interaction from the user. 
A key feature of this functionality is its speed, so that sending an interaction to the sequencer does not block the user from taking further actions.

#### Ordering

The sequencer's primary function is to arrange received interactions in a [linear order](/docs/sequencer/lifecycle/ordering). 
This order is determined collectively, meaning that all sequencer nodes must agree on it. 
In the first phase of operation of the decentralized sequencer, the decision about the order of interactions is made in a rotational manner, with each node proposing a block of interactions in turn.
The node that is currently proposing a block is called a *proposer*.

The default implementation of the sequencer node assumes that the order of interactions in the block will be the same as the order in which the node received them.
However, since other nodes cannot verify this order, in the future sequencer development phases, the decision about the order of interactions in a proposed block will be made in a more collaborative manner.

#### Syncing

Warp is a Layer 2 solution for Arweave that uses the sequencer to significantly improve the speed of smart contract interactions. 
This means that interactions take seconds instead of several minutes. 
However, the speed is not always a priority. 
In such use cases, sending interactions directly to Arweave is also possible.

[Warp Gateway](/docs/gateway/overview) provides indexing for both Layer 2 and Layer 1 interactions. 
This requires the sequencer to order all interactions in a linear fashion, which is necessary for the correct evaluation of the contract state. 
The sequencer periodically [downloads interactions](/docs/sequencer/lifecycle/receiving#syncing-with-arweave) from Arweave and stores them in its own blockchain. 
This ensures that all interactions are available to the gateway, regardless of whether they were sent directly to Arweave or through Warp Sequencer. 
To ensure that no interaction is skipped during the evaluation, the sequencer also assigns a pointer to its predecessor in the contract to each interaction.

It is important to emphasize once again that Layer 1 interactions will be processed with a delay, due to the nature of the Arweave consensus mechanism.

#### Randomness

Random values are often used in smart contracts for a variety of purposes, such as selecting winners in a lottery, determining which player goes first in a game, or generating unique identifiers. 
However, generating random numbers in a decentralized environment can be challenging, as it is crucial to ensure that the values are unpredictable. 
Yet, the value cannot be randomly drawn during the evaluation of the contract, as this process must be deterministic.

To address this challenge, the sequencer generates a [random value](/docs/sequencer/lifecycle/ordering#random-values) for each interaction. 
This value is based on the hash of the block in which the interaction is located, as well as the hash of the transaction itself. 
This ensures that the value is deterministic, meaning that it can be verified by other nodes in the network, but it is also unpredictable.

#### Relaying

Arweave is a permanent, decentralized storage network that provides a foundation for a variety of applications, including smart contracts. 
All interactions from SmartWeave protocol, including those processed by the Warp Sequencer, are eventually stored on Arweave.

To achieve this, the sequencer, after determining the order of interactions, [sends](/docs/sequencer/lifecycle/relaying) all calculated data to Arweave using [Turbo](https://ardrive.io/turbo/). 
This transfer is carried out by one of the nodes, which is selected rotationally, as with block production. 
The node that performs this task is called the *relayer*. 
The remaining nodes then verify whether the relayer has completed its task based on the proof provided by the relayer (confirmation signed by Turbo).

#### Notifying

Once the sequencer has ordered all interactions in a linear order, it is possible to query them. Queries can be made via [API](/docs/sequencer/api-methods). It is also possible to listen for events that are emitted during the operation of the sequencer. One can subscribe to these events using WebSocket.

Different applications can use these capabilities to monitor the sequencer's progress. For example, there is an application that subscribe to events emitted by the sequencer to store incoming interactions in a database, which is then used by the [Warp Gateway](/docs/gateway/overview). Thus, interactions that are sent to the sequencer are indexed shortly after and are ready for further processing.

## Roles

Based on the above functionalities, we can identify the following roles that sequencer nodes fulfill.

#### Validator

Validators form the sequencing network and play a critical role in ensuring the security and integrity of the decentralized mechanism. 
Their responsibilities include validating incoming interactions and broadcasting them to other network nodes. 
Validators also participate in the consensus process, where they independently validate blocks and ensure they have agreed upon the same value consistent with the protocol rules. 
To become a validator, individuals must hold a certain amount of the network’s native token as a stake, which can be slashed if they engage in misconduct or fail to fulfill their obligations. 
All active validators also fulfill the role of *syncer*, and from this group the role of *proposer* and *relayer* is also chosen.

#### Syncer

All active validators are required to download Arweave blocks and the interactions contained within them. 
This data is needed to include it in a block proposal (in the case of fulfilling the role of proposer) or to validate such a proposal. 
Due to the nature of the Arweave consensus algorithm and in order to ensure the determinism of the sequencer consensus, Arweave blocks are added to the sequencer network with a suitable delay.

#### Proposer

The role of the proposer within the sequencing network is vital for the creation of new blocks. 
Selected from the pool of active validators, the proposer is chosen using a [weighted round-robin algorithm](https://docs.cometbft.com/main/spec/consensus/proposer-selection). 
In other words, validators who stake more tokens have a higher chance of proposing a block. However, every validator eventually gets a chance to become a proposer. 
This promotes fairness while still incentivizing validators to hold more tokens.

The primary responsibility of the proposer is to construct a block containing an ordered list of interactions and propose it to the other validators. 
If the remaining nodes reach a consensus by voting with more than 2/3 of the votes, the proposed block is committed to the blockchain.

#### Relayer

Interactions pass through the sequencer to establish their order before being sent to Arweave. 
The relayer plays a crucial role in this process by facilitating the decentralized transmission of interactions from the sequencer to Arweave. 
Instead of directly sending data to Arweave, the relayer leverages [Turbo](https://ardrive.io/turbo/), which guarantees the reliable delivery of data to the blockchain.

The relayer’s task is to send the original user-signed interactions and including information about the sequencer chain’s block where the transactions were placed, particularly the interaction order within the block.

The relayer is selected among the validators using the same algorithm as the proposer. 
The difference is that the proposer is selected every block, while the relayer is selected for a certain number of blocks.

The network verifies the relayer’s adherence to their obligations by ensuring the delivery of valid receipts. 
The relayer is incentivized through rewards to maximize the amount of data sent and faces penalties, including token slashing, for misbehavior. 
In case of non-compliance, the responsibility is transferred to the next designated relayer.


## Technology Stack

The decentralized sequencer operates as a blockchain, where the sequencer network achieves consensus 
by producing blocks containing a sequentially ordered list of interactions. 
However, this is a blockchain specifically designed to establish the order of interactions. 
Ultimately, these interactions find their way to the main chain, Arweave.

The sequencer network is built on [Cosmos SDK](https://v1.cosmos.network/sdk), a modular framework that enables the tailored development of blockchains. 
This platform introduces a division into two layers.
The application layer is responsible for implementing business logic — in this context, establishing the linear order of interactions for a given SmartWeave contract. 
The second layer is the consensus layer, which is implemented using the well-known [Tendermint](https://tendermint.com) algorithm.
And more precisely, its extension, i.e. [Comet BFT](https://docs.cometbft.com/v0.37/introduction).

Tendermint employs a Byzantine Fault Tolerant (BFT) consensus algorithm, signifying its resilience to certain types of errors 
and attacks, even in scenarios where some nodes in the network are faulty or operate in a dishonest manner 
(referred to as Byzantine nodes in this context). Tendermint ensures consistent and secure operation across multiple machines. 
Consistency, in this context, means that each machine observes precisely the same list of interactions and calculates an identical state. 
Meanwhile, security is guaranteed by functioning even when up to 1/3 of the machines operate erroneously for various reasons.
