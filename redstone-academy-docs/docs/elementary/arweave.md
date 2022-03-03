# Welcome to Arweave

Arweave is a protocol that allows the permanent storage of data with a single fee. It connects people with disk space with those who need permanent storage.

Arweave is not a typical blockchain. Instead of keeping transactions in a chain of blocks, Arweave stores transactions in a graph of blocks. Each block is linked to two earlier blocks creating a structure called 'blockweave'.

:::info

Read more about Arweave on [ArWiki](https://arwiki.wiki/#/en/main) and if you want to gain an in-depth knowledge feel free to read the [yellow paper](https://www.arweave.org/yellow-paper.pdf).

:::

## ⚖️ Proof of Access

Instead of proof of work, Arweave uses a different consensus mechanism - Proof of Access. Unlike proof of work, PoA doesn't rely only on previous blocks to validate transactions. It uses the previous block and a random previous block in the chain. Miners need to prove that they have access to **recall** a block. This way, they don't need to recall the entire blockchain so less computation power is needed.

Transactions in this recalled block are then hashed against the current block to generate a new block. When miners solve the problem and find an appropriate hash they can share the new block and the recalled block with the network. In case of rare blocks, miners face less competition and the chance of being rewarded grows. The main advantage of Proof of Access is that it is not mandatory for miners to store all the data in the network.

## 🕸️ Permaweb

The permaweb is a permanent and fully decentralized web built on top of the Arweave blockchain where you can store all kinds of static files or web applications. Once uploaded, files and applications cannot be modified and they do not require any maintenance.

:::info
You can read some more on [Arwiki](https://arwiki.wiki/#/en/the-permaweb).
:::info

## ⛏️ Mining on Arweave

It is possible to mine AR, the native token of the Arweave blockchain. Anyone wishing to mine AR would need a minimum of 8GB and ideally use CPU power either through Windows or a Windows Subsystem on Linux. Remember, the more data you store the more likely you are to receive mining rewards.

:::info
A helpful and informative user guide to mining Arweave can be found here - https://docs.arweave.org/info/mining/mining-guide
:::

## ⛩️ Gateways

Gateways allow users to view content on the permaweb. Users gain access to files rendered locally by pointing to a transaction id.
Gateways not only enable the storage of static files but also allow entire web applications. In most of the cases, gateways expose a GraphQL interface for querying the tags linked to Arweave transactions. This allows developers to store content of their applications in Arweave transactions and build entire web applications on blockchain.

:::info
You can read some more on [Arwiki](https://arwiki.wiki/#/en/gateways).
:::

## 🪙 AR token

AR is the native token of the Arweave network. If you want to store data on Arweave you need to buy AR tokens to pay for data storage. If you have storage space for rent then you will be paid in AR too. AR has a limited supply of 66 million and can be bought and traded at most of the leading cryptocurrency exchanges.

:::info
You can find current AR price [here](https://app.redstone.finance/#/app/token/AR).
