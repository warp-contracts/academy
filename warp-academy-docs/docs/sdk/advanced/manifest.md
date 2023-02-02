# Contract Manifest

### Evaluation options
Evaluation options is a set of options that allow to configure how the Warp Contracts SDK will behave during contract evaluation.
The evaluation options are set via the `setEvalutionOptions` method on the `Contract` instance, example:
```ts
  warp.contract('<contract_tx_id>')
      .setEvaluationOptions({
        unsafeClient: "allow"
      });
```

The full set of currently available evaluation options is available [here](https://github.com/warp-contracts/warp/blob/main/src/core/modules/StateEvaluator.ts#L147).

### Manifest
To ensure that each client will evaluate the contract with the same evaluation options set - a
contract manifest can be specified during contract deployment.
The contract manifest is a set of evaluation options that are required by the contract to properly execute.  

In order to deploy a contract with a manifest, pass the manifest options in the `contractData` parameter of the `warp.deploy` method, e.g.:

```ts
const {contractTxId, srcTxId} = await warp.deploy({
      wallet,
      initState: initialState,
      src: jsContractSrc,
      evaluationManifest: {
        evaluationOptions: {
          unsafeClient: 'skip',
          internalWrites: true
        }
      }
    });
```  

In such case - the contract deployment transaction will contain a new tag - `Contract-Manifest`.  
Example - [oG4vBpf7IqmadALEM9XmguLTfRlztxDcX8lWdUfiHIM](https://sonar.warp.cc/#/app/contract/oG4vBpf7IqmadALEM9XmguLTfRlztxDcX8lWdUfiHIM#tags).

If the client's evaluation options are not compatible with the contract's manifest options - an error will be thrown, e.g.:
```
Error: Option {unsafeClient} differs. EvaluationOptions: [throw], manifest: [skip]. Use contract.setEvaluationOptions({unsafeClient: skip) to evaluate contract state.
Option {internalWrites} differs. EvaluationOptions: [false], manifest: [true]. Use contract.setEvaluationOptions({internalWrites: true) to evaluate contract state.
```

#### Interactions between contracts with different manifests
In case of an interaction between two contracts that both define a manifest - the idea is that evaluation of the foreign contract should not be processed with "less secure" evaluation options than those set for the main/root contract (i.e. the one that is being read by the User).

Currently, one exception to this rule are the internal writes.
Consider the examples below:

Example 1:
1. The root contract blocks internal writes
5. The foreign contract allows for internal writes
   => the internal writes should be allowed during evaluation of the foreign contract

Example 2:
1. The root contract has the 'unsafeClient' set to 'skip'
2. The foreign contract has the 'unsafeClient' to 'allow'
   => the 'unsafeClient' should be set to 'skip' for foreign contract

Example 3:
1. The root contract has the 'vm2' set to 'true'
2. The foreign contract has the 'vm2' set to 'false'
   => the 'vm2' for the foreign contract should be set to 'true'

Example 4:
1. The root contract has the 'maxCallDepth' set to 3
2. The foreign contract has the 'maxCallDepth' set to 5
   => the 'maxCallDepth' for the foreign contract should be set to '3'
   NOTE: call depth is always verified from the perspective of the root contract!

Example 5:
1. The root contract has the 'maxInteractionEvaluationTimeSeconds' set to 10
2. The foreign contract has the 'maxInteractionEvaluationTimeSeconds' set to 60
   => the 'maxInteractionEvaluationTimeSeconds' for the foreign contract should be set to '10'

On the other hand - if the root contract has less secure options than the foreign contract -
the more secure options of the foreign contract should be respected.
Example:
1. Contract "A" with 'unsafeClient' = 'allow' (and unsafeClient used in its source) is performing
   write operation on Contract "B" that has 'unsafeClient' set to 'skip'.
   i.e. Contract A calls SmartWeave.contracts.write on Contract B.

In this case the more secure setting of the Contract B should be reflected - and write itself
should be blocked (i.e. it should not be even created during the `A.writeInteraction` - when a dry-run
is being performed, and we're evaluating a list of internal writes for a newly created interaction).

All rules are defined in [https://github.com/warp-contracts/warp/blob/main/src/contract/EvaluationOptionsEvaluator.ts#L21](https://github.com/warp-contracts/warp/blob/main/src/contract/EvaluationOptionsEvaluator.ts#L21)

### `sourceType` evaluation option
A special evaluation option - `sourceType` allows to control what kind of the interactions the SDK will load to
evaluate the contract state.  
The possible values are:
- `SourceType.ARWEAVE` - only direct, Arweave transactions will be loaded 
- `SourceType.WARP_SEQUENCER` - only Warp Sequencer registered transactions will be loaded
- `SourceType.BOTH` - both Warp Sequencer and direct Arweave transactions will be loaded

You can specify this option in a contract manifest to make sure that all clients will use the transactions of the same source:

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