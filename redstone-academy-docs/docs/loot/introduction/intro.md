# Implementation tutorial for loot contract on SmartWeave

This tutorial shows how to implement a simple loot contract on the SmartWeave protocol.

## 💡 The smart contract idea

We will implement a simple [LOOT](https://www.lootproject.com/)-like contract, which allows us to generate and transfer different magical assets, for example `black silver sword` or `blue gold crown`. Each asset will be unique and can belong to only one wallet at a time.

Initially there are no generated assets, but users will be able to generate and claim them.
Users also will be able to transfer their assets to others.

## 🚀 Deployed version

We've already deployed this contract on the Arweave blockchain. Its transaction id is [Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY](https://scanner.redstone.tools/#/app/contract/Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY). You can check its source code in our [SonAR.](https://sonar.redstone.tools/#/app/contract/Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY#code).

Final implementation is available in the [github repo](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-loot).

## 🙋‍♂️ Need help?

Please feel free to contact us [on Discord](https://redstone.finance/discord) if you have any questions.

## 🧰 Prerequisites

- Prepared Node.js environment
- `yarn` installed
- Basic Javascript coding skills
- Basic understanding of [SmartWeave](https://www.npmjs.com/package/redstone-smartweave)

## 📦 Install dependencies

```bash
# Install dependencies
$ yarn add arweave@1.10.23 redstone-smartweave@0.4.53

# Install dev dependencies
$ yarn add arlocal@1.1.30 jest -D
```
