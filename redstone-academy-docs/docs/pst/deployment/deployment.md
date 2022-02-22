# Deployment

### Setting up Arweave

As mentioned earlier, we will deploy our contract to RedStone public testnet. You will notice that is very similair to how we deployed contract to ArLocal. We just need to write a NodeJS script which will generate and fund Arweave wallet read, contract source and initial state files and deploy contract to the testnet. At the end of this chapter, I'll show you how to repeat all these steps in order to deploy contract to Arweave mainnet.

Like the last time - firstl, we will need to declare variables that will be needed in the script. Head to
