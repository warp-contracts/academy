# ♾️ Chapter V - Fire & forget
Sending the interactions (with the training data from the RedStone Oracles) manually every minute would be a rather dumb idea - that's why
we will automate it!

<figure style={{width: 400}}>

![cloud.jpeg](/img/tutorial/ml/cloud.jpeg)
<figcaption align = "center"><i>"a guy without a clue tries to deploy a function to a cloud service, futuristic scene, simple colors and shapes, retro futurism old poster"</i></figcaption>

</figure>

## The plan

Because we like to make our lives miserable and complicated, we will use GCP's Cloud Functions. 

We will need:
1. A Cloud Function that will load the price from the RedStone Oracles and post it to our contract
2. A Pub/Sub topic that will trigger the above function
3. A Scheduler that will post a message to the Pub/Sub topic at a given interval

## The code

First we need to create a new folder - `btc-price-function`.
Inside this folder we will create two files:
1. `package.json`
```json
{
  "name": "btc-price-function",
  "version": "1.0.0",
  "description": "A GCP Cloud Function to fetch and post BTC price",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "redstone-sdk": "^1.0.9",
    "warp-contracts": "1.3.3"
  },
  "engines": {
    "node": ">=18"
  }
}
```

2. `index.js` - which contains the code of our cloud function
```javascript
const {requestDataPackages} = require("redstone-sdk");
const {defaultCacheOptions, LoggerFactory, WarpFactory} = require('warp-contracts');

async function postBtcPrice(message, context) {
  // Extract the parameter from the Pub/Sub message
  const messageData = JSON.parse(Buffer.from(message.data, 'base64').toString());
  const contractTxId = messageData.contractTxId;

  const reqParams = {
    dataFeeds: ["BTC"],
    dataServiceId: "redstone-avalanche-prod",
    uniqueSignersCount: 1,
  };

  const dataPackagesResponse = await requestDataPackages(reqParams);
  const btc = dataPackagesResponse["BTC"][0];

  // turn off any logging within Warp
  LoggerFactory.INST.logLevel('none');
  const warp = WarpFactory.forMainnet({...defaultCacheOptions, inMemory: true});
  const wallet = await warp.arweave.wallets.generate();

  const contract = warp
    .contract(contractTxId)
    .connect(wallet);

  await contract.writeInteraction({
    function: 'train',
    pricePackage: btc.toJSON(),
  });
}

// Export the function as a Cloud Function
exports.postBtcPrice = postBtcPrice;
```
:::info
The above function is posting the transactions via [Warp Sequencer](../../docs/sdk/advanced/bundled-interaction). When using the Warp Sequencer,
you don't need to have any ARs, tokens or weird, web2-ish API keys.  
All you need is a wallet (which can be generated on the fly) that will allow to identify
who is interacting with the contract.
:::

## The `gcloud` CLI
Let's install `gcloud` CLI that will allow us to interact with the GCP via a command line.

1. Let's first install the `gcloud` CLI. The exact procedure depends on your OS - a nice description is in the
GCP's [docs](https://cloud.google.com/sdk/docs/install).

2. We obviously also need an account in the GCP itself. The GCP (at the time of writing) offers a free trial
with 300$ to be used within 90 days. Signup for a trial [here](https://console.cloud.google.com/freetrial/signup/).

3. With the `gcloud` installed and the account created, we need to init the `gcloud` CLI.
Simply call
```shell
gcloud init
```
The tool will ask you to login into your account and choose the project - select `Create a new project` and follow the prompts.

After the initialization, verify that you're logged in and that the default project is set.  
Type:
```shell
gcloud config list
```

It should output something similar to:
```shell
gcloud config list
[core]
account = <your@account>
disable_usage_reporting = False
project = <your_project_created_during_init>
```

In case the `project` was not set, type
```shell
gcloud projects list
```
Check the value in the `PROJECT_ID` column, and then set the project as a default via:
```shell
gcloud config set project <PROJECT_ID>
```

## The deployment
Assuming that `gcloud` is properly installed and configured, we need to call two simple commands:

1. Deploy `postBtcPrice` function with a Pub/Sub trigger on the `btc-price-topic` topic. If the topic does not exist, it will be created automatically.
```sh
gcloud functions deploy postBtcPrice \
  --runtime nodejs18 \
  --trigger-topic btc-price-topic \
  --entry-point postBtcPrice \
  --region us-central1 \
  --timeout 30s
```

2. Create a Cloud Scheduler job that triggers the function every minute via Pub/Sub:
```sh
gcloud scheduler jobs update pubsub post-btc-price-every-30-seconds \
  --schedule "* * * * * " \
  --topic btc-price-topic \
  --message-body "{\"contractTxId\": \"<your_contract_tx_id>\"}" \
  --time-zone "UTC" \
  --location us-central1
```
:::info
Remember to set your contract's tx ID in the `message-body` parameter.
:::

:::tip
Google Cloud Scheduler does not support seconds. The smallest scheduling interval is one minute.
:::

If everything went well, you should see the `TRAIN` function being called every ~minute in SonAR:
![img.png](/img/tutorial/ml/sonar.png)  

But there is one issue here...

<img src="/img/tutorial/ml/the_boys.webp" />



