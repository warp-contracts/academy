### SmartWeave Global API

All contracts have access to a global object `SmartWeave`. It provides access to additional API for getting further information or using utility and crypto functions from inside the contracts execution. It also allows to interact with other contracts and read other contracts states.

List of available options:

* transaction informations:
  - SmartWeave.transaction.id
  - SmartWeave.transaction.owner
  - SmartWeave.transaction.tags
  - SmartWeave.transaction.quantity
  - SmartWeave.transaction.reward

* contract
  - SmartWeave.contract.id
  - SmartWeave.contract.owner

* contracts
  - readContractState(contractId: string)
  - viewContractState(contractId: string, input: any)
  - write(contractId: string, input: any)
  - refreshState()

* block informations:
  - SmartWeave.block.height
  - SmartWeave.block.timestamp
  - SmartWeave.block.indep_hash

* Arweave utils
  - SmartWeave.arweave.utils
  - SmartWeave.arweave.crypto
  - SmartWeave.arweave.wallets
  - SmartWeave.arweave.ar

* potentially non-deterministic full Arweave client:
  - SmartWeave.unsafeClient

* evaluation options
  - SmartWeave.evaluationOptions

* VRF
  - SmartWeave.vrf.data
  - SmartWeave.vrf.value
  - SmartWeave.vrf.randomInt(maxValue: number)

* other
  - SmartWeave.useGas(gas: number)
  - SmartWeave.getBalance(address: string, height?: number)
  - SmartWeave.gasUsed
  - SmartWeave.gasLimit

* extensions - additional `SmartWeave` options which can be for example injected through dedicated plugins (an example of such in [`warp-contracts-plugins` repository](https://github.com/warp-contracts/warp-contracts-plugins)).s