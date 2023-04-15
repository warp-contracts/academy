# Epilogue

## What we've learned
We've introduced and (hopefully) learned:
1. some more advanced features of the Warp Contracts - constructors, custom extension (and the risks of using them!),
contract's manifest.  
2. how to use the `brain.js` library inside a smart contract and how to build a simple neural network
for predicting BTC prices.
3. how to load price packages from the RedStone Oracles and verify them inside Warp Contracts.
4. how to deploy a Cloud Function that is automatically triggered on a specified interval.


<img src="/img/tutorial/ml/homelander.webp" />

## Next steps
Having all the pieces of the puzzle together - what would be the next steps to consider?

1. Add timestamps validation (as described in [Chapter II](chapter-2#verifying-data-package))
:::tip
Use the `SmartWeave.block.timestamp` and `SignedDataPackage.dataPackage.timestampMilliseconds`.  
Remember, that the first one is in seconds 🙂.
:::
2. Make `brain.js` compatible with a deterministic PRNG
3. Measure the neural network performance, i.e. compare the predicted prices to the real ones, see what's the diff 
(maybe create a graph?), whether it's decreasing with time, etc.
4. Predicting the crypto prices using technical analysis tools is probably not very effective 🙃.
A better idea would be probably to feed a neural network with something like tweets, articles, etc. - and 
try to measure and predict the 'sentiment' towards given asset.
5. Think about tokenizing
   1. the data (maybe consider each piece of data as a NFT and a market of such NFTs - where buyers - when they obtain NFT ownership, are able to decode the data and use it for learning their networks. Obviously
a seller would need to somehow prove that the data is legit - without revealing it before selling -
I guess we could add another buzzword here - ZK proofs)
   2. the computation itself - e.g. you want to use a given neural network (specified in a smart contract) with your data,
   but you don't own a warehouse of GPUs and a small nuclear plant to power them - so you post the data to the
   'computation' market in sth like https://github.com/ethereum/EIPs/issues/677 format. Accepting the 
   transaction by a given 'miner'/'evaluator' would cause the token transfer and computation to be performed.
6. Find a way to feed the contract with large amount of data - i.e. how to deterministically load the data
inside the contract - e.g. from a separate Arweave transaction.
:::info
   One possible solution here is to specify the tx ID of the 'data' transaction within the interaction transaction tags.  
   The Warp SDK would then need to first load such transaction directly from Arweave gateways - and if that would
   fail (e.g. because of gateways being overloaded or you being rate limited) - the SDK would immediately stop the evaluation.    
   This solution would however require some 'Oracle' (guess which oracle would work here best 😎) that would confirm, that
   the transaction was indeed posted AND properly mined by the Arweave network (no matter if it is L1 transaction or a bundle).  
   If it wasn't, the SDK would simply move to the next interaction.
:::








