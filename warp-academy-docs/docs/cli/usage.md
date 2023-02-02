# Usage

```sh

Usage: warp [options] [command]

Options:
  -wlt, --wallet <string>                     Path to the wallet keyfile (e.g.: ./secrets/wallet.json)
  -env --environment <string>                 Envrionment in which action needs to be executed: local | testnet | mainnet (default:
                                              "mainnet")
  -lvl --level <string>                       Logging level: silly | trace | debug | info | warn | error | fatal | none (default: "none")
  -c --cacheLocation <string>                 Realtive path for the Level database location (default: "/cache/warp")
  -sil --silent                               Run CLI in silent mode (no logo, only error messages displayed, logged result not formatted
  -v, --version                               Display current version of Warp SDK
  -h, --help                                  display help for command

Commands:
  generate                                    Generate project template
  deploy                                      Deploy contract
  read [options] <contractId>                 Read contract state based on contract id
  write [options] <contractId> <interaction>  Write interaction to the contract based on specified contract id
  view <contractId> <input>                   View state of the contract based on specified contract id and provided input
  clear                                       Clears cache
  help [command]                              display help for command
```
