import ReactPlayer from 'react-player';

# SmartWeave

## 🤝🏾 What are smart contracts?

In general, smart contracts are programs that run on blockchain when predetermined conditions are met. They automatically execute events or actions accordingly to the terms of contract.

Smart contracts are deployed to the blockchain and are not controlled by the user - they run how they were programmed. User accounts interact with the contract by submitting transactions which execute functions from the contract.

<ReactPlayer controls url="https://www.youtube.com/watch?v=ZE2HxTmxfrI" />

## 🧵 SmartWeave

Arweave has its own version of a smart contract system. SmartWeave is a data-centered protocol built on top of the Arweave blockchain. It is unique because it deploys a lazy evaluation method. In other traditional smart contract systems it is a nodes responsibility to validate the results of a smart contract. SmartWeave's lazy evaluation transfers the burden of computation transaction validation to the smart contract user.

As it is written in the protocol:

> Most smart contracts treat data as a side-product that slows down processing. Data is digested, pruned, and pushed out to side chains. Nonetheless, the bloated global state is still the biggest challenge of modern blockchains - as it leads to extreme costs of data storage. The SmartWeave approach, on the other hand, has several advantages:
>
> 1. It decouples the storage from the computation.
> 2. It allows for a flexible lazy-evaluation pattern.
> 3. It allows to directly process rich content.
>
> — SmartWeave protocol

In general, it works like this. Contract source code (simple JavaScript function) and its initial state are deployed to Arweave and posted as transactions. They must meet the requirements from the protocol (e.g. contains specific tags). Then, when a user interacts with a contract, all of the prior transactions are evaluated until the end of chain of valid transactions. Here is the exact explanation

> In order to evaluate the contract state, SmartWeave Protocol client:
>
> 1. Loads all the contract interaction transactions up to the requested block height.
> 2. Sorts the interaction transactions. The order of the interactions is determined firstly by interaction transaction block height (i.e. when the transaction was mined in the chain) and secondly by sha256(transactionId + blockHash). The full ordering is [ block_height, sha256(transactionId + blockHash) ].
> 3. Applies the sorted interactions onto the contract's handler function - evaluating the contract state up to the requested block height.
>
> — SmartWeave protocol

In order to fully understand the process of contract creation we advise you to read the full protocol linked below.

:::info

You can read more about smart contracts on Arweave in the following resources:

[https://arwiki.wiki/#/en/smartweave](https://arwiki.wiki/#/en/smartweave)
[https://dev.to/apollotoday/deploying-your-first-arweave-contract-15jc](https://dev.to/apollotoday/deploying-your-first-arweave-contract-15jc)

You can find SmartWeave protocol here:

[https://github.com/warp-contracts/warp/blob/main/docs/SMARTWEAVE_PROTOCOL.md](https://github.com/warp-contracts/warp/blob/main/docs/SMARTWEAVE_PROTOCOL.md).

:::

## 🧶 Warp SDK

Warp SDK is a new implementation of SmartWeave protocol that has been written from scratch. It focuses on performance and modularity by adding some enhancements to the first version of SmartWeave SDK.

Warp consist of three main layers:

1. **The Core Protocol layer** - is the implementation of the original SmartWeave protocol and is responsible for communication with all of the SmartWeave smart contracts deployed on Arweave.
2. **The Caching layer** - is built on top of the Core Protocol layer and allows the seperate caching results of each of the Core Protocol modules.
3. **The Extensions layer** - includes everything that can be built on top of the core SDK - including Command Line Interface, Debugging tools, different logging implementations etc.

Modular implementation has multiple advantages - principally, it can be tested and developed separately. The Warp client is more customizable as different types of caches can be used for web and node environments. It also enables adding different loaders responsible for loading interaction transactions registered for a given contract. You can use `ArweaveGatewayInteractionsLoader` which uses Arweave gateway. Alternatively, it is possible to make use of `WarpGatewayInteractionsLoader` which uses a gateway dedicated to loading smart contracts transactions, available under [https://gateway.redstone.finance](https://gateway.redstone.finance/) url. You can view the instructions of how to use it in the SDK [here](https://github.com/warp-contracts/warp#using-the-redstone-gateway).

We will use Warp SDK throughout the whole course so you will have an advanced understanding of how it works and how you can use its features when creating your own application.

:::info
You can read more about Warp smart contracts in a [dedicated repository](https://github.com/warp-contracts/warp). You can also find base motivation behind rewriting the original SDK [here](https://github.com/warp-contracts/warp/blob/main/docs/ROAD_MAP.md).

:::
