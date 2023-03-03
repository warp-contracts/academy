# Evaluation options

Evaluation options is a set of options that allow to configure how the Warp Contracts SDK will behave during contract evaluation.
The evaluation options are set via the `setEvalutionOptions` method on the `Contract` instance, example:
```ts
  warp.contract('<contract_tx_id>')
      .setEvaluationOptions({
        unsafeClient: "allow"
      });
```

The full set of currently available evaluation options is available [here](https://github.com/warp-contracts/warp/blob/main/src/core/modules/StateEvaluator.ts#L156).


### `sourceType` evaluation option
A special evaluation option - `sourceType` allows to control what kind of the interactions the SDK will load to
evaluate the contract state.  
The possible values are:
- `SourceType.ARWEAVE` - only direct, Arweave transactions will be loaded
- `SourceType.WARP_SEQUENCER` - only Warp Sequencer registered transactions will be loaded
- `SourceType.BOTH` - both Warp Sequencer and direct Arweave transactions will be loaded

:::tip

You can specify this option in a [contract manifest](https://academy.warp.cc/docs/sdk/advanced/manifest/) to make sure that all clients will use the transactions of the same source, e.g.:

```ts
const {contractTxId, srcTxId} = await warp.deploy({
      wallet,
      initState: initialState,
      src: jsContractSrc,
      evaluationManifest: {
        evaluationOptions: {
          sourceType: SourceType.ARWEAVE
        }
      }
    });
```  

:::

### State auto sync
In order to synchronise current contract state with a D.R.E node there are dedicated evaluation options:
- `remoteStateSyncEnabled` - Allows to load contract state from remote source and store it in cache, skipping the whole evaluation process.
- `remoteStateSyncSource` - Remote source, by default it is `dre-1.warp.cc`.
If the remote source does not have the latest state, another state read with remote sync disabled should fetch all the missing interactions.

```ts
contract.setEvaluationOptions({
   remoteStateSyncEnabled: true
})
```  
