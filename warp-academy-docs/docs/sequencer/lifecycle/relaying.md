# Relaying Process

The Warp Sequencer functions as an intermediate step in the lifecycle of interactions but it is not the final destination. 
Arweave, as the Layer 1 solution, is the ultimate repository for these interactions.

## The Crucial Role of Arweave

While the Warp Sequencer efficiently establishes the order of interactions within its Layer 2 framework, the ultimate goal is to securely anchor these interactions on Arweave, the decentralized Layer 1 protocol. 
This transition from Warp to Arweave is not just a procedural step; it is a strategic move with profound implications for the reliability, permanence, and decentralization of the interactions within the network.

Why Arweave integration matters:
#### Data Permanence
Arweave is renowned for its immutable and permanent storage capabilities. 
Unlike the transitory nature of Layer 2 solutions, Arweave ensures that once interactions are recorded, they become an indelible part of the blockchain, creating an enduring record of the network's history.
#### Decentralized Security
Arweave's decentralized security model provides a stark contrast to the relatively smaller Warp network. 
By anchoring interactions on Arweave, the network leverages the decentralized and tamper-resistant nature of the blockchain, enhancing the reliability of interactions.
#### Focused Acceleration
Warp Sequencer is purposefully designed to serve as a catalyst for smart contracts on Arweave, rather than aspiring to become an independent network. 
The primary ambition is to expedite and enhance the functionality of smart contracts within the robust infrastructure provided by Arweave.
#### Network Collaboration
Warp's role is collaborative rather than competitive. 
By focusing on Arweave as the primary repository for interactions, the network aligns itself with the overarching vision of building a sustainable and resilient decentralized ecosystem. 
This collaboration fosters a robust foundation for future growth and innovation on Arweave.

## Decentralized Interaction Submission to Arweave

In the same decentralized spirit as the sequencing process, the submission of interactions to Arweave should also unfold through a decentralized mechanism. 
It is imperative that every interaction sender can be confident that by submitting their interaction to the sequencer, it will ultimately find its way to Arweave.

----
[DIAGRAM FOR RELAYER]

----

### Mechanism of Interaction Submission

- The node that is currently responsible for forwarding interactions to Arweave is called the *Relayer*.
- Only one node serves as the relayer at any given time.
- The selection of the relayer from the pool of active validators follows a process analogous to [proposer selection](/docs/sequencer/lifecycle/ordering#block-proposal).
- The difference is that the proposer is selected for each round, and the relayer is selected after the previous relayer's turn has ended.
- The selected relayer has a defined timeframe to send a specified number of interactions to Arweave.
- The relayer receives rewards for each successfully submitted block, incentivizing them to dispatch as many blocks as possible. 
It is crucial to note that the relayer can only send a block for which all blocks of lower height have been sent.
- The relayer utilizes [Turbo](https://ardrive.io/turbo/), responsible for ensuring finality in data submission to Arweave.
- After sending data to Turbo, the relayer receives a receipt, which is then added to the sequencer network.
- Other nodes validate the received receipt, particularly checking if it is correctly signed by Turbo.
- Failure to fulfill the task within the specified time may result in penalties for the relayer.
- In case of Turbo unavailability, the relayer has the option to report this to other nodes to avoid penalties for non-submission, given that the issue is beyond their control.

:::info
In the initial phase of decentralized sequencer operation, the relayer functions as an off-network application. 
However, a first milestone on the [roadmap](/docs/sequencer/roadmap) for sequencer development involves migrating this functionality onto the sequencer itself, following the outlined scheme.
:::

### Data Format for Arweave Submission

The format of data sent to Arweave depends on the type of interaction.

Interactions that were sent directly to Arweave and then retrieved by the sequencer do not need to be sent back to Arweave.
For such interactions, only the values assigned by the sequencer are sent.
This includes the sort key, prev sort key, random value, information about the Arweave block containing the interaction, and details about the sequencer block in which the Arweave block was added.

For interactions sent to the sequencer, the same data as mentioned above is sent.
However, the original interaction that the sequencer received from the client is also sent.
This is accomplished through a nesting mechanism (see: [Nested bundle](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md#31-nested-bundle)).
In other words, a DataItem is sent, which contains sequencer-specific data and simultaneously wraps another DataItem that is the original interaction.

The DataItem containing sequencer-specific data includes the following tags.

#### Global Tags

| Tag Name                                    | Tag Value                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Sequencer`                                 | `Warp`                                                                                                     |
| `Source`                                    | - `warp` for interactions sent to Warp Sequencer<br/>- `arweave` for interactions sent directly to Arweave |
| `Env`                                       | Environment - `prod` for the production environment, example of other environments: `dev`/`test`           |

#### Block Data Tags

| Tag Name                                    | Tag Value                                                       |
| ------------------------------------------- | --------------------------------------------------------------- |
| `Arweave-Block-Height`                      | Height of the latest Arweave block added to the sequencer       |
| `Arweave-Block-Timestamp`                   | Timestamp of the latest Arweave block added to the sequencer    |
| `Arweave-Block-Hash`                        | Hash of the latest Arweave block added to the sequencer         | 
| `Sequencer-Height`                          | Height of the sequencer block                                   |
| `Sequencer-Timestamp`                       | Timestamp of the sequencer block                                |

#### Interaction Data Tags

| Tag Name                                    | Tag Value                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------|
| `Tx-Id`                                     | Interaction ID                                                                                  |
| `Contract-Tx-Id`                            | Transaction ID with the contract                                                                |
| `Sort-Key`                                  | Sort key                                                                                        |
| `Prev-Sort-Key`                             | Sort key of the previous interaction in this contract (only if it is not the first interaction) |
| `Random`                                    | Pseudorandom value for the interaction                                                          |

:::tip
The above data is used, among others, by the [Arweave Interactions Loader](/docs/sdk/advanced/arweave-interaction-loader) 
(specifically, by the implementation adapted for the decentralized sequencer).
:::