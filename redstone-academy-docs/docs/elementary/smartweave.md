import ReactPlayer from 'react-player';

# SmartWeave

### What are smart contracts?

In general, smart contracts are just regular programs that run on blockchain when predetermined conditions are met. They are automatically executing events or actions accordingly to the terms of contract.

They are deployed to the blockchain and they are not controlled by the user - they just run how they were programmed. User accounts then interact with the contract by submitting transactions which execute functions from the contract.

<ReactPlayer controls url="https://www.youtube.com/watch?v=ZE2HxTmxfrI" />

### SmartWeave

Arweave version of smart contracts - SmartWeave - is unique because unlike other traditional smart contract systems where it is node's responsability to validate smart contract's result, it deploys a lazy evaluation method which transfers the burden of computation transaction validation to the smart contract user.
In general, it works like this. Contract source code and its initial state are deployed to Arweave and posted as transactions. Then, when user interacts with a contract, all of the prior transactions are evaluated until the end of chain of valid transactions. After this operation, user writes the state change to Arweave network. This way, all the contract's users are validating all of the contracts' transactions.

:::info

You can read more about smart contracts on Arweave in following resources:

[https://arwiki.wiki/#/en/smartweave](https://arwiki.wiki/#/en/smartweave)
[https://dev.to/apollotoday/deploying-your-first-arweave-contract-15jc](https://dev.to/apollotoday/deploying-your-first-arweave-contract-15jc)

You can find SmartWeave protocol here:

[https://github.com/redstone-finance/redstone-smartcontracts/blob/main/docs/SMARTWEAVE_PROTOCOL.md](https://github.com/redstone-finance/redstone-smartcontracts/blob/main/docs/SMARTWEAVE_PROTOCOL.md).

:::

### RedStone SmartContracts SDK

RedStone SmartContracts SDK is a new written from scratch implementation of SmartWeave protocol. It focuses on the performance and modularity by adding some enhancements to the first version of SmartWeave SDK.

RedStone SmartContracts consist of three main layers:

1. **The Core Protocol** layer is the implementation of the original SmartWeave protocol and is responsible for communication with the SmartWeave smart contracts deployed on Arweave.
2. **The Caching layer** - is build on top of the Core Protocol layer and allows caching results of each of the Core Protocol modules separately.
3. **The Extensions layer** - includes everything that can be built on top of the core SDK - including Command Line Interface, Debugging tools, different logging implementations etc.

Modular implementation has multiple advantages - it can be tested and develop separately. The SmartWeave client is more customizable as different types of caches can be used for web and node environment.

:::info
You can read more about RedStone smart contracts in a [dedicated repository](https://github.com/redstone-finance/redstone-smartcontracts). You can also find base motivation behind rewriting the original SDK [here](https://github.com/redstone-finance/redstone-smartcontracts/blob/main/docs/ROAD_MAP.md).

:::
