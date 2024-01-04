# Data Format

This chapter specifies the format of data stored by the sequencer network.

## Genesis state

The genesis state of the Warp Sequencer is the initial data that is used to start the blockchain. This data includes:
- Information about the Arweave block from which the sequencer will start.
- Data required to calculate the prev sort key for interactions handled by the sequencer.

### Arweave Block Information

The first type of data needed for the sequencer to start is information about the Arweave block that was last processed by the previous centralized sequencer, 
as well as data about the Arweave block that will be added first to the sequencer blockchain, along with the interactions it contains.
These details are extracted from the `arweave_block.json` file, and a sample representation is provided below:

```json
{"lastArweaveBlock":
   {"height":1318268,
   "timestamp":1702040807,
   "hash":"VwqjV_2VMlh5DzLHUbk0n3EN_a5aRbe-H2xIFACZ9AmZrujSwwmEdxt4B_M0jYxl"},
 "nextArweaveBlock":
    {"blockInfo":
       {"height":1318269,
        "timestamp":1702040913,
        "hash":"CQCojSIk5irYvdnsvWKm1d62Oh5z9G3X7qAbNjcu2Yh-KYzgz1IYT9GIpaYIs6cJ"},
        "transactions":
           [{"id":"UAie4Tyqlz5eCTQK_aqoRzWznZ0UCdckTm6E4pjA_HE",
             "contract":"KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
             "sort_key":"000001318269,0000000000000,56802e09c3d3310140df996fa70be6eccc8c28e715c601e39d820a6be816f54c"},
            {"id":"6t-OqbyGeQ-yigDbwRcChtjwpB8w5uswg_yvd9LHE5A",
             "contract":"KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
             "sort_key":"000001318269,0000000000000,6849c6ab2791631ed9645dfb9a7eea6868bcb5f6aa1fea19700bc48a4f9345b9"},
            {"id":"1iJSdydrcR2YqEsZ8DVrKIrIIdv-MG7WvRL6cCe76Is",
             "contract":"KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
             "sort_key":"000001318269,0000000000000,e6472aac3115163f3a14de480744be6dc6fc29f860397e50662ea18d7a9bff2f"}]}}
```
Where:
- `lastArweaveBlock` is information about the block that was last processed by the previous sequencer.
- `nextArweaveBlock` is the Arweave block that will be added first to the sequencer.

### Previous Sort Keys for Contracts

Information about the sort key of the last interaction for each contract is crucial for assigning prev sort keys to interactions handled by the sequencer. 
This data is sourced from the `prev_sort_keys.json` file, structured as follows:
```json
[{"contract":"007g_77MJ1eJaeRvDYwj4Po-6_2_G-5DGyN7eX3AL4o",
  "sortKey":"000001025889,1664397554325,6dca2bac0ee65c6f3a3b0f3e5fe5d162c130bc5c39ea203524b5b799d1ad7f04"},  
 {"contract":"008p0JdJA0XY79o139Us9OgXbcLmxiKubZ_7v31HZOI",
  "sortKey":"000001119402,1676452495692,13468b18dd98a9c0fe9cb3e6f5b482ad14da1b744dea660a373fadb0ff0360d9"},
 {"contract":"0094QB2iMzuy7h-W5_577li7kat2jb3EXYmDxRYm2yM",
  "sortKey":"000001237223,1691593745386,b4c26ef252025f97b6684fb88e5a2c66ec4f8b1b9d5899e1c05859550aa3265b"},
 {"contract":"00Bh4GLtT1kY4sAu3QbsXH3ZSuXa2iBaVXO64LJovp8",
  "sortKey":"000000801138,0000000000000,1ed5d58b01f4deda06dcd61bd4e1d8494e82142df0d8333758d8a6d0648eb78f"},
 ...
]
```

## Messages format

Sequencer blocks encapsulate [transactions](https://docs.cosmos.network/main/learn/advanced/transactions), which in turn contain [messages](https://docs.cosmos.network/main/build/building-modules/messages-and-queries). 
Within the realm of Warp Sequencer, two fundamental types of messages play a pivotal role: those tailored for incoming interactions and those designed for Arweave blocks retrieved by the sequencer.
Messages are defined and serialized in the [Protocol Buffers](https://protobuf.dev/) format.

### Interaction message

The `MsgDataItem` message is used to store an interaction sent to the sequencer. The message has the following structure:
```protobuf
message MsgDataItem {
  bytes data_item = 1;
  string sort_key = 2;
  string prev_sort_key = 3;
  bytes random = 4;
}
```

### Arweave block message

The `MsgArweaveBlock` message is used to store an Arweave block that has been downloaded by the sequencer. The message has the following fields:

```protobuf
message MsgArweaveBlock {
  ArweaveBlockInfo block_info = 1;
  repeated ArweaveTransactionWithInfo transactions = 2;
}
```
The first field of the message consists of basic information about the Arweave block:
```protobuf
message ArweaveBlockInfo {
  uint64 height = 1;
  uint64 timestamp = 2;
  string hash = 3;
}
```
The second field contains a list of the following interaction data:
```protobuf
message ArweaveTransactionWithInfo {
  ArweaveTransaction transaction = 1;
  string prev_sort_key = 2;
  bytes random = 3;
}
```
Above, we have the values assigned by the sequencer, as well as the data about the original interaction with Arweave:
```protobuf
message ArweaveTransaction {
  string id = 1;
  string contract = 2;
  string sort_key = 3;
}
```

## Data stored in sequencer nodes

Sequencer nodes need to store certain data in order to process interactions. This data includes:
- The data of the last Arweave block that has been added to the sequencer.
- The sort key of the last interactions for all contracts.

The consistency of this data between nodes is checked with each sequencer block, which contains the [AppHash](https://github.com/cometbft/cometbft/blob/v0.37.x/spec/core/data_structures.md#header) - a hash that is calculated based on the above data, among other things.

### Last Arweave block

Information about the most recent Arweave block added to the sequencer is crucial for various processes, particularly in the calculation of sort key values for incoming interactions. 
It is essential to recall that the first component of this key is the height of the referenced Arweave block.

The details about the last block can be obtained by traversing backward through the last sequencer blocks until the message with the Arweave block is found. 
However, for performance reasons, this data is stored in a dedicated store and is easily accessible.

The format of the data stored is as follows:
```protobuf
message LastArweaveBlock {
  ArweaveBlockInfo arweave_block = 1;
  int64 sequencer_block_height = 2;
}
```
This struct contains two fields:
- `arweave_block` - basic Arweave block data.
- `sequencer_block_height` - height of the sequencer block where the last Arweave block was added.

### Previous sort keys

Every interaction passing through the sequencer that is not the initial interaction of a particular contract must be assigned a `prev sort key`. 
To achieve this, sequencer nodes maintain a map where, for each key representing the transaction identifier of a contract, a value is set as the sort key of the last interaction for that contract. 
Each entry in this map takes the following form:
```protobuf
message PrevSortKey {
  string contract = 1; 
  string sortKey = 2; 
}
```

### Arweave blocks queue

In addition to the above stores, each validator in the sequencer network downloads and maintains a list of upcoming Arweave blocks to be added to the sequencer network. The block synchronization process is detailed [here](/docs/sequencer/lifecycle/receiving#syncing-with-arweave).

Unlike the aforementioned stores, the Arweave blocks queue is not cross-validated between nodes because nodes may be at different stages of block retrieval. This consistency is verified when adding an Arweave block to the sequencer block and validating these blocks.

The data format stored in the queue is as follows:

```protobuf
message NextArweaveBlock {
  ArweaveBlockInfo blockInfo = 1;
  repeated ArweaveTransaction transactions = 2;
}
```

This structure includes information about the upcoming Arweave block and a list of transactions that will be incorporated into the sequencer network upon processing.
