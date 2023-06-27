# 🔨 Chapter VI - Curb Your Enthusiasm
Remember that big warn in Chapter II about extensions' determinism?

<figure style={{width: 400}}>

![elephant.jpeg](/img/tutorial/ml/elephant.jpeg)
<figcaption align = "center"><i>"different copies of an elephant in the room, futuristic scene, simple colors and shapes, retro futurism old poster"</i></figcaption>

</figure>

## The problem...

The `brain.js` library is not deterministic by default.
You can easily verify it by yourself - training the network with the same input will each time produce
a _slightly_ different network state.  
Or you can try to call `predict` with the exact same input on the same model - each time the result will be _slightly_ different.

LSTM models, like most neural networks, rely on random weight initialization and stochastic gradient descent (watch the `Prerequisites` videos...) during
the training process. These random elements make it difficult to achieve a deterministic training process.

## ...and how to fix it.
But we won't give up that easily!
<img src="/img/tutorial/ml/butcher_2.webp"  style={{marginBottom:20, width: 300}}/>

Let's drill down a little further. The source of non-determinism in the `brain.js` library comes from using `Math.random`:
![img.png](/img/tutorial/ml/brainjs.png)

\- e.g. in the `shuffleArray` function which is used by the `train` function.

This can be fixed - we need to set a seed for the random number generator.
Let's first add `seedrandom` library:  
```sh
npm install --save seedrandom
```

The easiest way to seed the `Math.random` is to call:
```js
import seedrandom from 'seedrandom';

Math.random = seedrandom(contractTxId);
```

**BUT** - as the `seedrandom` library warns:
:::caution
calling `Math.seedrandom('constant')` without `new` will make `Math.random()` predictable globally,
which is intended to be useful for derandomizing code for testing, but should not be done in a production library.
If you need a local seeded PRNG, use `myrng = new Math.seedrandom('seed')` instead.
:::

So this solution is good for making some local tests or using it in a fully isolated environment (e.g. the way how
the D.R.E. nodes are evaluating the contracts - each evaluation happens in a forked node process with a separate V8 instance).

The ultimate solution would be to fork the `brain.js` library and add an option of passing a custom PRNG in the neural network
constructor.
