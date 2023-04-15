# 📈 Chapter IV - Back to the future
Now we're cooking!

<figure style={{width: 400}}>

![forecast.jpeg](/img/tutorial/ml/forecast.jpeg)
<figcaption align = "center"><i>"female cyborg working on technical analysis, futuristic scene, simple colors and shapes, retro futurism old poster"</i></figcaption>

</figure>

With our model being trained, we can now  write another contract function - `predict` (a 'view' function).
:::info
In Warp, 'view' functions are contract functions that do not modify the contract state - instead
they return some 'view' of the current contract state.
:::

We will use `forecast` from the `LSTMTimeStep` neural network.  

This function is specifically designed for time series prediction tasks. It takes a sequence of input
values and a specified number of time steps to forecast into the future. 
The function returns an array of predicted values for the specified number of future time steps
based on the input sequence. 

The contract's `predict` function will require passing two parameters:
1. `prices` - an array of input prices that will serve as a base for predicting output prices
2. `toPredict`- the amount of prices to predict

After validating the input data, contract will map prices to a proper format (same as
for the `doTrain` function - it will calculate diffs and normalize to `[0, 1]`).
The neural network, based on already trained data and the normalized `prices` will predict
`toPredict` new normalized price diffs.

The result of this prediction needs to be denormalized - and finally - the price diffs added consecutively,
starting from the last price from the input.

The `forecast` function can be called like this:

```javascript
const view = await contract.viewState({
    function: 'predict',
    prices: [30000, 30010, 30005, 30020, 30015],
    toPredict: 3
  });

  console.dir(view.result);
```

Example result:
```sh
Float32Array(3) [ 30028.6328125, 30042.02734375, 30057.388671875 ]
```

The full `predict` function code:
```javascript
if (input.function === 'predict') {
  // the model has to be trained at least once
  if (state.serializedModel === null) {
    throw new ContractError('Not enough train data yet!');
  }

  // input data validation - prices
  const forecastInput = input.prices;
  if (forecastInput?.length == 0) {
    throw new ContractError('Not enough input prices to forecast')
  }

  if (forecastInput.length > 10) {
    throw new ContractError('Too many input prices');
  }

  // input data validation - toPredict
  const toPredict = input.toPredict;
  if (toPredict > forecastInput.length) {
    throw new ContractError('Too many values to forecast');
  }

  // creating network and loading its model from contract's state
  const net = createNetwork();
  net.fromJSON(state.serializedModel);

  // preparing input prices - same as for 'train' function
  const {minDiff, maxDiff, normalizedDiffs} = preparePrices(forecastInput);

  // cooking...
  const forecastNormalizedDiffs = net.forecast(normalizedDiffs, toPredict);
  
  // denormalizing forecasted diffs
  const forecastDiffs = forecastNormalizedDiffs.map(d => denormalize(d, minDiff, maxDiff));
  
  // taking the last price from the input...
  let lastPrice = forecastInput[forecastInput.length - 1];
  
  // ...and adding the forecasted diffs consecutively
  const forecastPrices = forecastDiffs.map((diff) => {
    lastPrice += diff;
    return lastPrice;
  });

  // 
  return {
    result: forecastPrices,
  }
}
```

With the contract code ready, we now need to find a way to regularly feed it with price data...


