# Networks

Before we start writing tests, we need to understand different types of networks on Arweave blockchain.

## 🕸️ Mainnet

Mainnet is the final version of blockchain which is fully functional. It means that the blockchain protocol is fully developed and deployed. Mainnet allows users to send and receive transactions which are recorded on a distributed ledger. Distributed ledger technology (DLT) is a consensus of replicated, shared, and synchronized digital data (in opposition to centralized systems there is no central administrator of the shared data).

:::info
The gateway that delivers data from the nodes is [arweave.net](https://arweave.net/).

You can also explore its GraphQL which is responsibe for querying for transaction or block metadata on Arweave [here](https://arweave.net/graphql).

You can find a nice guide for GraphQL [here](https://gql-guide.vercel.app/#payment-data).

HTTP API which can help us explore the network can be found in the [docs](https://docs.arweave.org/developers/server/http-api).
:::

:::info
Instead of heading to arweave.net you can request and query nodes directly. Nodes are Arweave users with large storage spaces on their hard drives, they connect with Arweave network and store data for others. You can use exactly the same API as for the gateway. List of all currently running nodes can be found on [arweave.net/peers](https://arweave.net/peers).
:::

:::info
Here you can find [Arweave Network launch report](https://arweave.medium.com/arweave-network-launch-report-b7e7ffac0f75).
:::

### Testnet

Unlike mainnet, testnet means that the network is not running on its full capacity. It is used by developers to test different kind of actions, features before posting them to mainnet.

We will make use of two kinds of testnets.

1. ArLocal - it's a local server which resembles Arweave mainnet. You need to run it locally on your computer.

:::info

You can read more about ArLocal in a [dedicated repository](https://github.com/textury/arlocal).

:::

2. RedStone testnet - it's a public testnet based on ArLocal. It does not require any instance to be run locally. The blocks are mined every 10s so you don't have to wait for the transaction as long as in case of mainnet. You can also mine block manaully, same way you would do it on ArLocal.

:::info
Redstone public testnet i available [here](https://testnet.redstone.tools)

We will use ArLocal for our tests and RedStone public testnet for deploying contract and writing interactions. Testnets main aim is to create close-to-real environment which is very similair to Arweave. There are of course small differences which we will point out.
