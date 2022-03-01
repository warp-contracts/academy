# Welcome to Arweave

Arweave is a protocol that allows to store data permanently with a single fee. It connects these with disk space with those who need permanent storage.

Arweave is not a typical blockchain. Instead of keeping transactions in a chain of blocks, Arweave stores them in a graph of blocks. Each block is linked to two earlier blocks creating a structure called 'blockweave'.

:::info

Read more about Arweave on [ArWiki](https://arwiki.wiki/#/en/main) and if you want to gain an in-depth knowledge feel free to read the [yellow paper](https://www.arweave.org/yellow-paper.pdf).

:::

### Proof of Access

Instead of proof of work, Arweave uses different consensus mechanism - Proof of Access. Unlike this first one, PoA doesn't rely only on previous block to validate transactions. It uses previous block and a random block in chain. Miners need to proof that they have access to **recall** block. This way, they don't need the entire blockchain so not as big compuation power is needed.

Transactions in this recall block are then hashed against the current block to generate a new block. When miners solve the problem and find an appropriate hash they can share the new block and recall block with the network. In case of rare blocks, miners have to face less competition and chance of getting rewarded grow. It is not mandatory for miners to store all the data in the network.

### Permaweb

The permaweb is a permanent and fully decentralized web built on top of Arweave. You can store all kinds of static files or web applications. Once uploaded, files/applications cannot be modified and they don't require being maintained.

:::info
You can read some more on [Arwiki](https://arwiki.wiki/#/en/the-permaweb).
:::info

### Gateways

Gateways allow users to view content on the permaweb. Users gain access to files rendered locally by pointing to a transaction id.
Not only gateways enable storing static files but also allow entire web applications. In most of the cases, gateways expose a GraphQL interface for querying the tags linked to Arweave transactions. Thanks to that developers can store content of their applications in Arweave transactions and build entire web applications on blockchain.

:::info
You can read some more on [Arwiki](https://arwiki.wiki/#/en/gateways).
:::

### AR token

AR is the currency of the Arweave network. If you want to store data you need to buy AR tokens to pay for data storage.

:::info
You can find current AR price [here](https://app.redstone.finance/#/app/token/AR).
