# Warp Syncer

Warp-Syncer is an umbrella project for implementing various tasks related to downloading and uploading SmartWeave data to Arweave. 

## Commands

Warp-Syncer is a single binary that can be run with different commands:


| Command      | Description                                                                                    |
|-------------:|------------------------------------------------------------------------------------------------|
| **sync**     | Download L1 interactions from Arweave                                                          |
| **forward**  | Send L and L2 interactions from the database to Redis. Assign last_sort_key to L1 interactions |
| **contract** | Download L1 contracts                                                                          |
| **bundle**   | Send L2 interactions to bundlr.network                                                         |
| **check**    | Monitor if bundles are finalized                                                               |
| **gateway**  | Run a REST API server                                                                          |
| **help**     | Help about any command                                                                         |
| **env**      | Show evnironment variables used for configuration                                              |

