# Sequencer

Let's start with explaining the regular flow of deploying contract or writing interactions. If anyone wants to deploy a contract or interact with it, they use methods which create, sign and post transactions on **Arweave**. Easy, right? The only problem with this approach is that we are posting our transactions directly to **Arweave** blockchain. And that means that we need to wait for our transactions to be mined, only then we can be sure our contract or interaction is valid. In theory it can take up to 20 minutes. Now, imagine developing this cool dApp with magnificent UX. It would be disappointing if we force our users to wait that long until they see the result of their interactions with the dApp.

That's way we introduced the **Warp Sequencer** which uses **Bundlr Network** underneath.

### Sequencer

At the core of bundling transactions lies the sequencer which bundles and assigns order to SmartWeave interactions. The algorithm responsible for ordering transactions is backwards compatible which means that interactions registered with sequencer can be used together with those sent directly to **Arweave**. The ordering follows the [FIFO approach](https://www.investopedia.com/terms/f/fifo.asp), taking into account the sequencer's timestamp, current **Arweave** network block height and is salted with the sequencer's key - to prevent front running.

### Bundlr

We also used [Budlr Network](https://docs.bundlr.network/) which guarantees data finality and data upload reliability. Bundlr assures that the transaction will be posted on **Arweave** (usually within a few hours). In the receipt which is received from the upload function, we get a `block` field which is set to the maximum block the transaction will be in.

### Warp Gateway

Lastly, bundled transactions are indexed by [Warp gateway](https://github.com/warp-contracts/gateway) which then enables SmartWeave interactions loading.

### Instant transactions availability

These three pieces provide instant transaction availability. It means that we don't need to wait for our transaction to be available for 20 minutes, instead - it is available in milliseconds, enhancing overall user experience. Try for yourself how fast you can interact with the contract in our [Warp9 app](https://warp9.warp.cc/).

In the following sections you will see in practice, how to benefit from this solution.
