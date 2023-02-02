# Commands

### Generate

Generate one of the project templates provided in [this repository](https://github.com/warp-contracts/templates). Clones chosen Github subdirectory into new project. Sample contract with tools to deploy contract in test and mainnet environment as well to test the contract are provided. Additionally, template for frontend app - either in React or in Vue can be added to the project.

```sh
warp generate
```

### Deploy

Executes deploying contract creator which asks user wether the contract will be deployed from file or from source transaction id and questions for the type of the contract (WASM or Javascript), if WASM is chosen, it then asks for the specific language in which contract is written (Rust, Assemlbyscript or Go). Lastly, user needs to provide source transaction id or path to the source file, path to the initial state file, path to the WASM source file (in case of WASM contracts) and path to the WASM glue code (in case of Rust contracts). It is possible to upload data within the contract (e.g. in case of deploying Atomic NFT contract) which will be put in a data field of the contract transaction - in that case user needs to provide type of data (e.g. `image/png`) and relative path to the data asset.

Contract is then deployed, its id is returned to the user and SonAr link is provided (for testnet and mainnet environment).

```sh
warp deploy
```

### Read

Reads contract state based on its id.

Arguments:

1. `<contractId>` - id of the contract

Options:

1. `-sv --save [string]` - instead of logging state to the console, saves state to a file, if no argument is provided it saves state with a default name, if user enters name for a file (e.g.: `state.json`) - state is saved under that name
2. `-eo --evaluationOptions <string...>` - allows to set one of three evaluation options - `allowBigInt`, `allowUnsafeClient` or `internalWrites`
3. `-stval --stateValidity` - besides state, returns validity of all the contract interactions
4. `-sterr --stateErrorMessages` - besides state, returns error messages for the invalid contract interactions

```sh
warp read Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY -stval -sterr -eo allowBigInt internal wrrites -sv
```

### Write

Writes interaction to the contract based on its contract id and provided input.

Arguments

1. `<contractId>` - id of the contract
2. `[interaction]` - interaction to the contract in a stringified form

Otions

1. `-str --strict` - if set, `writeInteraction` method evaluates the state and lets verify wether transaction has been processed correctly
2. `-eo --evaluationOptions <string...>` - allows to set one of three evaluation options - `allowBigInt`, `allowUnsafeClient` or `internalWrites`

```sh
warp write Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY '{"function": "transfer", "to": "aRQwckYG8gmcVNG0EL68dFwHi7gW53FkrHdTdzxFVRI"}' -str -eo allowBigInt
```

### View state

View state of the contract based on its id and provided input.

1. `<contractId>` - id of the contract
2. `[input]` - input to the contract in a stringified form

```sh
warp view 1otA3fcu5TTjCciIFy1L9vic8plXrfT7AW1CjfS3Cr8 '{"function": "balance", "target": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M"}'
```

### Clear cache

Clears cache folder created during reading contract state. By default, command removes `/cache/warp` folder. It is possible to change it using global `cacheLocation` option.

## Global options

1. `-wlt --wallet` - relative path to the wallet, if not provided - new wallet is generated, its keyfile is save to a file in `.secrets` folder
2. `-env --environment` - environment in which action needs to be executed `mainnet` | `testnet` | `local`
3. `-lvl -level` - logging level for Warp: `silly` | `trace` | `debug` | `info` | `warn` | `error` | `fatal` | `none`, by default level is set to `none`
4. `-c -cacheLocation` - relative path for the Level database location, by default it is set to `/cache/warp`
5. `-sil --silent` - run CLI in silent mode (no logo, only error messages displayed, logged result not formatted)
6. `-v --version` - displays current version of the Warp SDK
