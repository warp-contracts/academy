# Overview

Warp Gateway is currently publicly available under [https://gateway.warp.cc/](https://gateway.warp.cc/).
The contracts explorer web app - SonAR is available under [https://sonar.warp.cc/](https://sonar.warp.cc/).

### Problem

SmartWeave is an Arweave-based protocol for lazy-evaluated smart contracts. Each interaction with a contract is saved as
a separate Arweave transaction. In order to evaluate the contract state, all of its interactions must be loaded first.

The current available solution ("general-purpose" Arweave gateway) has some flaws. The interactions can be loaded using the GQL endpoint, which can return only 100 interactions in a single batch/query. At the time of writing, each query takes from ~300ms to ~5 seconds. For our [loot contract](https://sonar.warp.cc/#/app/contract/Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY) (that has almost 10K interactions) it means that loading all the interactions takes around 1 minute. There are contracts with much more interactions - the biggest one has over 280K interactions - loading all the interactions for this contract takes ~3 hours. This clearly shows that the current solution scales poorly and is a first big obstacle for a wider SmartWeave contracts adoption.

### Our solution

Warp Gateway is a fast and reliable way to load SmartWeave transactions. Several tasks are responsible for retrieving interactions and contracts data from Arweave gateway and Arweave peers directly. Data is then indexed in the gateway allowing to load interactions for the contract in seconds.

Additionally, a few endpoints are exposed so it is possible to upload contracts or interactions through Bundlr and index them in the gateway (more about it in the [HTTP Api section](/docs/gateway/http/get/contracts)).
