# 🍲 What's Cookin' Doc?

We will build a Warp contract that will try its best to forecast BTC price 🔮.


<figure style={{width: 400}}>

![robot-cooking.jpeg](/img/tutorial/ml/robot-cooking.jpeg)
<figcaption align = "center"><i>"1950s robot, cooking blocks in pot, retro futurism old poster with WARP title"</i></figcaption>

</figure>

It will use a simple neural network trained with data posted in the interactions with the contract.  
We will show how to use some advanced features of the Warp Contracts
(like [constructors](../../docs/sdk/advanced/constructor), custom [extensions](../../docs/sdk/advanced/plugins/custom-extension) and
[contract manifests](../../docs/sdk/advanced/manifest)).  
We will show how to load the price data from the RedStone Oracles and verify it in the contract.  
We will also show how to periodically feed the contract with a new data.

### 👨🏼‍🎓 Prerequisites
It's good to have a basic knowledge of how the Warp Contracts work, understand what Arweave is and a basic Javascript/Node.js knowledge.
You can find a lot of useful information here in [Warp Academy](https://docs.warp.cc).    
Some basic understanding of neural networks might be also useful - if you need a quick introduction,
this [video series](https://www.youtube.com/watch?v=aircAruvnKk) has a great visualisations of what the neural network is doing ("not as a buzzword but as a piece of math").  
If you don't have much experience with neural networks, I suggest watching at least first 3 videos.


### 🏁 Final code
1. Smart contract code is [here](https://github.com/warp-contracts/example-redstone/blob/main/lstm.contract.js).
2. The Cloud Function is [here](https://github.com/warp-contracts/example-redstone/tree/main/btc-price-function).
3. A testing script is [here](https://github.com/warp-contracts/example-redstone/blob/main/local.mjs).

<img src="/img/tutorial/ml/butcher_3.webp" />
