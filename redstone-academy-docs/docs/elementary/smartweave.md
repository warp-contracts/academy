import ReactPlayer from 'react-player';

# SmartWeave

## 🤝🏾 What are smart contracts?

In general, smart contracts are just regular programs that run on blockchain when predetermined conditions are met. They are automatically executing events or actions accordingly to the terms of contract.

They are deployed to the blockchain and they are not controlled by the user - they just run how they were programmed. User accounts then interact with the contract by submitting transactions which execute functions from the contract.

<ReactPlayer controls url="https://www.youtube.com/watch?v=ZE2HxTmxfrI" />

## 🧵 SmartWeave

Arweave has its own version of smart contract system. SmartWeave is a data-centered protocol built on top of Arweave blockchain. It is unique because it deploys a lazy evaluation method. In other traditional smart contract systems it is node's responsibility to validate smart contract's result. SmartWeave's lazy evaluation transfers the burden of computation transaction validation to the smart contract user.

As it is written in the protocol:

> Most smart contracts treat data as a side-product that slows down processing. Data is digested, pruned, and pushed out to side chains. Nonetheless, the bloated global state is still the biggest challenge of modern blockchains - as it leads to extreme costs of data storage. SmartWeave approach, on the other hand, has several advantages:
>
> 1. It decouples the storage from the computation
> 2. It allows for a flexible lazy-evaluation pattern
> 3. It allows to directly process rich content.
>
> — SmartWeave protocol

In general, it works like this. Contract source code (simple javascript function) and its initial state are deployed to Arweave and posted as transactions. They must meet the requirements from the protocol (e.g. contains specific tags). Then, when user interacts with a contract, all of the prior transactions are evaluated until the end of chain of valid transactions. Here is the exact explanation

> In order to evaluate contract state, SmartWeave Protocol client:
>
> 1. Loads all the contract's interaction transactions up to the requested block height.
> 2. Sorts the interaction transactions. The order of the interactions is determined firstly by interaction transaction block height (i.e. when the transaction was mined in the chain) and secondly by sha256(transactionId + blockHash). The full ordering is [ block_height, sha256(transactionId + blockHash) ].
> 3. Applies the sorted interactions onto the contract's handler function - evaluating contract's state up to the requested block height.
>
> — SmartWeave protocol

In order to fully understand the process of contract creation we advise you to read full protocol linked below.

:::info

You can read more about smart contracts on Arweave in following resources:

[https://arwiki.wiki/#/en/smartweave](https://arwiki.wiki/#/en/smartweave)
[https://dev.to/apollotoday/deploying-your-first-arweave-contract-15jc](https://dev.to/apollotoday/deploying-your-first-arweave-contract-15jc)

You can find SmartWeave protocol here:

[https://github.com/redstone-finance/redstone-smartcontracts/blob/main/docs/SMARTWEAVE_PROTOCOL.md](https://github.com/redstone-finance/redstone-smartcontracts/blob/main/docs/SMARTWEAVE_PROTOCOL.md).

:::

## 🧶 RedStone SmartContracts SDK

RedStone SmartContracts SDK is a new written from scratch implementation of SmartWeave protocol. It focuses on the performance and modularity by adding some enhancements to the first version of SmartWeave SDK.

RedStone SmartContracts consist of three main layers:

1. **The Core Protocol layer** - is the implementation of the original SmartWeave protocol and is responsible for communication with the SmartWeave smart contracts deployed on Arweave.
2. **The Caching layer** - is build on top of the Core Protocol layer and allows caching results of each of the Core Protocol modules separately.
3. **The Extensions layer** - includes everything that can be built on top of the core SDK - including Command Line Interface, Debugging tools, different logging implementations etc.

Modular implementation has multiple advantages - it can be tested and developed separately. The SmartWeave client is more customizable as different types of caches can be used for web and node environment. It also enables adding different loaders responsible for loading interaction transactions registered for given contract. You can use `ArweaveGatewayInteractionsLoader` which uses Arweave gateway. Alternatively it is possible to make use of `RedstoneGatewayInteractionsLoader` which uses gateway dedicated to loading smart contracts transactions, available under [https://gateway.redstone.finance](https://gateway.redstone.finance/) url. You can view the instructions of how to use it in the SDK [here](https://github.com/redstone-finance/redstone-smartcontracts#using-the-redstone-gateway).

We will use RedStone SDK throughout the whole course so you will have an advanced understanding of how it works and how you can use its features when creating your own application.

:::info
You can read more about RedStone smart contracts in a [dedicated repository](https://github.com/redstone-finance/redstone-smartcontracts). You can also find base motivation behind rewriting the original SDK [here](https://github.com/redstone-finance/redstone-smartcontracts/blob/main/docs/ROAD_MAP.md).

:::
