# Implementation tutorial for Ardit contract on SmartWeave

This tutorial shows how to implement a simple AtomicNFT based contract.

## 💡 The smart contract idea

The idea of this tutorial is to build a smart contract which can be then used in decentralized social application. The contract itself is based on AtomicNFT standard which we originally wrote in Rust as part of our WRC, you can view the source code [here](https://github.com/warp-contracts/wrc/tree/master/contracts/atomic-nft). For the purposes of this tutorial we will re-write the AtomicNFT contract to Typescript and add some additional functions to it. AtomicNFT will be then deployed repeatedly as each of these contracts will be a separate post. Thanks to AtomicNFT functionalities, these posts will be transferable and each of it will have its owner. Additionally, we will add functions which will let users to upvote or downvote the post.


## 🚀 Deployed version

_TODO: Update addresses_

We've already deployed the contract source on the Arweave blockchain. Its transaction id is [xOnWzXwuZ8PYbrjOBpz-kEAV0l0_soyvrxAS35weysU](https://sonar.warp.cc/#/app/source/xOnWzXwuZ8PYbrjOBpz-kEAV0l0_soyvrxAS35weysU). You can check its source code in our [SonAR.](https://sonar.warp.cc/#/app/source/xOnWzXwuZ8PYbrjOBpz-kEAV0l0_soyvrxAS35weysU#code).

The final implementation is available in the [github repo](https://github.com/warp-contracts/academy/tree/main/warp-academy-ardit/final).

## 🙋‍♂️ Need help?

Please feel free to contact us [on Discord](https://redstone.finance/discord) if you have any questions.

## 🧰 Prerequisites

- Prepared Node.js environment
- `yarn` installed
- Elementary Javascript coding skills
- Basic understanding of [SmartWeave](https://www.npmjs.com/package/warp-contracts) and
  [Warp](https://medium.com/@RedStone_Finance/prepare-for-warp-speed-b2a516120849) contracts

## 💪 What will you learn

- Deploying multiple contracts
- Implementing cross-contract interactions (aka [internal writes](https://github.com/warp-contracts/warp#internal-writes))
- Architecting a contract that may control other assets
- Fully understanding how one of the most important DeFi protocol works under the hood
  (Tons of satisfaction guaranteed :) )