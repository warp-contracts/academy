# 🧠 Chapter III - No pain, no gain
It's high time to train our network! 💪

<figure style={{width: 400}}>

![training.jpeg](/img/tutorial/ml/training.jpeg)
<figcaption align = "center"><i>"decentralized neural network training, futuristic scene, retro futurism old poster"</i></figcaption>

</figure>

You've probably noticed `doTrain` function in last code listing in previous chapter.
This function will be called every 5th price package sent to our contract
and will use those new prices to continue to train the network (this process is called "incremental learning").

To build and train our network we will use [brain.js](https://github.com/BrainJS/brain.js) library.
The library uses WebGL (through the GPU.js library) to perform GPU-accelerated operations, 
which means it works in both web browsers and Node.js environments. Since WebGL is platform-independent,
you can use GPU acceleration on various operating systems, including Windows, macOS, and Linux.

### Adding brain.js SmartWeave extension
We will need to create a separate extension for the `brain.js`.

```js
export class BrainJsPlugin {
  process(input) {
    input.LSTMTimeStep = brain.recurrent.LSTMTimeStep;
  }

  type() {
    return 'smartweave-extension-brain';
  }
}
```

We're attaching only the `LSTMTimeStep` neural network, which should be well suited for our task of predicting price.  
A quick introduction by GPT-4 is attached in the [Appendix](appendix#please-explain-lstm-timestep-neural-network-to-a-web3-developer).

We now need to attach the new plugin to the Warp instance:
```js
const warp = WarpFactory.forMainnet()
  .use(new RedStonePlugin())
  .use(new BrainJsPlugin());
```

### Initializing the neural network
Let's create a separate function that will create our neural network:
```javascript
function createNetwork() {
  return new SmartWeave.extensions.LSTMTimeStep({
    inputSize: 1,
    hiddenLayers: [10, 10],
    outputSize: 1,
  });
}
```
This network has a single input and output and is using two hidden layers (you watched the introductory video
from [Prerequisites](whats-cooking/#-prerequisites), did you?), each with 10 nodes/neurons. Feel free to experiment with different values.

With the above function - let's return to implementing the `doTrain` function.

### Prepare the input data
Our network will perform best if the input data will be normalized into values within `[0, 1]` range.
We will use a simple Min-Max normalization function.
```javascript
function normalize(value, min, max) {
  if (min === max || min > max) {
    throw new ContractError("Invalid range: min and max must be different and min must be smaller than max.");
  }
  return (value - min) / (max - min);
}

function denormalize(value, min, max) {
  return value * (max - min) + min;
}
```
Additionally - training on the price differences can be a good idea, as it focuses on the changes in prices rather than their absolute values.
So let's create additional function, that will calculate the price diffs:
```javascript
function calculateDiffs(prices) {
  return prices.slice(1).map((price, index) => price - prices[index]);
}
```

Having these building blocks - we can now finally write our function that will prepare the data for our neural network:
```javascript
function preparePrices(prices) {
  // calculate price diffs
  const priceDiffs = calculateDiffs(prices);
  const minDiff = Math.min(...priceDiffs);
  const maxDiff = Math.max(...priceDiffs);
  
  // normalize prices diffs into [0, 1] range
  const normalizedDiffs = priceDiffs
    .map(d => normalize(d, minDiff, maxDiff));

  return {
    minDiff,
    maxDiff,
    normalizedDiffs
  };
}
```

### Training the network
With the price diffs calculated and normalized, we can finally feed them to our network.
```javascript
net.train([normalizedDiffs], {
    iterations: 2000,
    log: (stats) => logger.debug(stats),
    errorThresh: 0.005,
  });
```

After training the network, we store its model in contract's state:
```javascript
state.serializedModel = net.toJSON();
```

The full `doTrain` function:
```javascript
function doTrain(state) {
  // intialized LSTM TimeStep neural network
  const net = createNetwork();
  
  // if network model is available - read it from json 
  if (state.serializedModel) {
    net.fromJSON(state.serializedModel);
  }

  logger.info('toTrain', state.toTrain);

  // in order to properly calculate price diffs for all the new values - add
  // one value from previous trainging set.
  let firstElementAdded = false;
  if (state.trainedData?.length) {
    // get last element (if available) from already trained data to properly calculate
    // the diff for the first element of the new data
    state.toTrain = [state.trainedData[state.trainedData.length - 1], ...state.toTrain];
    firstElementAdded = true;
  }

  // calulate prices diffs and normalize them into [0,1] range
  const {normalizedDiffs} = preparePrices(state.toTrain.map(p => p.v));

  // train the network
  net.train([normalizedDiffs], {
    iterations: 2000,
    log: (stats) => console.log(stats),
    errorThresh: 0.005
  });

  // store network model in contract state
  state.serializedModel = net.toJSON();
  if (firstElementAdded) {
    state.toTrain.shift();
  }
  state.trainedData.push(...state.toTrain);
  
  // clear the array that contains data for training
  state.toTrain = [];
}
```

With the model being trained, we can now try to forecast the future prices.
