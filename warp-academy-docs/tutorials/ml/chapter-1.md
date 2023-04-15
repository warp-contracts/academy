# 🔮 Chapter I - The Oracle
The first problem that we need to solve is how to get a high quality and reliable data (i.e. the BTC prices).
Fortunately, [RedStone Oracles](https://redstone.finance/) got us covered here 🫡.

<figure style={{width: 400}}>

![oracle.jpeg](/img/tutorial/ml/oracle.jpeg)
<figcaption align = "center"><i>"a futuristic oracle serving data, hexagonal symbol, simple colors, red tint, retro futurism old poster"</i></figcaption>

</figure>

Let's add `redstone-sdk` library:  
```sh
npm install --save redstone-sdk
```

In order to get a signed data package with current BTC price, we will use the `requestDataPackages` function from the `redstone-sdk`:
```js
async function getPricePackage() {
  const reqParams = {
    dataFeeds: ["BTC"],
    dataServiceId: "redstone-avalanche-prod",
    uniqueSignersCount: 1,
  }
  const dataPackagesResponse = await requestDataPackages(reqParams);

  return dataPackagesResponse["BTC"][0];
}
```

We're using the [redstone-avalanche-prod](https://app.redstone.finance/#/app/data-services/redstone-avalanche-prod)
data-service.

After obtaining the price package - it can be easily passed into transaction with a contract:

```javascript
// create a Warp instance
const warp = WarpFactory.forMainnet();

// create contract instance and connect wallet
const contract = warp
  .contract(contractTxId)
  .connect(wallet);

// obtain price package from RedStone Oracles
const pricePackage = await getPricePackage();

// send interaction with a contract to Warp Sequencer
await contract.writeInteraction({
  function: 'train',
  pricePackage: pricePackage.toJSON(),
});
```

With the price data sent in the interaction transaction - we can now try to unpack it and verify inside the contract.

<img src="/img/tutorial/ml/easy-peasy.gif" />
