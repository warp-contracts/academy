# Overview

Warp Contracts SDK is the implementation of the SmartWeave [Protocol](https://academy.warp.cc/docs/sdk/smartweave-protocol) - a smart contracts protocol on Arweave blockchain.  
SmartWeave protocol decouples the execution of the contracts from the consensus (i.e. the ordering of the transactions).

The Warp Contracts SDK allows to interact with SmartWeave contracts (deploying new contracts, reading state, writing new interactions, etc.).

It works in both web and Node.js environment (requires Node.js 16.5+).

TODO: wypad z tym  
⚠️ Do not use "Map" objects in the state of js/ts contracts - since maps by default are not serializable to JSON and won't be properly stored by the caching mechanism. Use "plain" objects instead.
[More info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_vs._maps) - the "Serialization and parsing" row.