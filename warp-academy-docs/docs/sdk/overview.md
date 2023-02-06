# Overview

Warp Contracts SDK is the implementation of the SmartWeave [Protocol](https://academy.warp.cc/docs/sdk/smartweave-protocol) - a smart contracts protocol on the Arweave blockchain.

:::info
In a nutshell - SmartWeave protocol decouples the execution of the contracts from the consensus (i.e. the ordering of the transactions).
:::

All the data (the contracts' code and interactions) are kept on-chain, but the evaluation of the state happens off-chain.
This has a huge advantage in terms of scalability (in comparison to monolithic systems - like Ethereum) - as the execution layer
may be developed and scaled independently of the main (consensus) layer.

The Warp Contracts SDK allows to interact with SmartWeave contracts (deploying new contracts, reading state, writing new interactions, etc.).

It works in both web and Node.js environment.
