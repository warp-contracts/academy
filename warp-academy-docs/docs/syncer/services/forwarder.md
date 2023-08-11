# Introduction

Forwarder is the service responsible for:

- sending L1 and L2 interactions from the database to Redis
- assigning last_sort_key to L1 interactions


## Run

```bash
# Start from the last saved block
./syncer forward
```


## Architecture

### Processing L1 interactions

Forwarder receives changes of Syncer's finished block height through Postgres notifications. This change informs that all L1 interactions from this block are saved in the database and are ready for processing. Forwarder downloads all interactions (in batches) from the database, computes `last_sort_key` for each interactions and saves all info in the database. `FORWARDER_FINISHED_HEIGHT` is updated with the last batch.


### Sending L1 and L2 interactions

L2 interactions are received asynchronously with a Postgres notification from the database and sent to Redis. If a new L1 block is detected then sending L2 interactions is paused to prevent mixing L1 and L2 in the stream. It's resumed after the last L1 interaction is sent.

```mermaid
graph TD
    A[Send L1 interactions <br/> to Redis ] -->|Success| B[Send L2 interactions <br/> as soon as they appear]
    B -->|Check| C{SYNCER_FINISHED_HEIGHT updated}
    C -->|Yes| A
    C -->|No| B
```

### Dependency on Syncer

Forwarder works closely with Syncer in a two-stage process. Syncer downloads interactions and Forwarder processes them.

```mermaid

sequenceDiagram
    autonumber
    participant Arweave Network
    participant Syncer
    participant DB
    participant Forwarder
    loop For every CURRENT_HEIGHT 
        Note over Syncer: SYNCER_FINISHED_HEIGHT = <br/> ARWEAVE_CURRENT_HEIGHT - <br/> CONFIRMATION_BLOCKS 
        Syncer->>Arweave Network: Download block for height <br/> SYNCER_FINISHED_HEIGHT
        activate Syncer
        Syncer->>DB: Save interactions 
        Syncer->>DB:  Save SYNCER_FINISHED_HEIGHT
        deactivate Syncer
    end
    loop For every SYNCER_CURRENT_HEIGHT
        activate Forwarder
        Forwarder ->> DB: Get L1 interactions <br/> already stored by Syncer
        Forwarder ->> DB: Compute last_sort_key <br/> for each L1 interaction
        Forwarder ->> DB: Get L2 interactions <br/> added by Sequencer
        Note over Forwarder: Forward to Redis
        deactivate Forwarder
    end

```

### Internals

Here are some details about how Forwarder works internally. Each box in the diagram is a separate `Task`, everything is set up in `controller.go`.


```mermaid
flowchart TD
    Database --> Sequencer
    Database <--> Fetcher
    Sequencer --> |L1 block info| Fetcher
    Fetcher --> |L1 interactions| Joiner
    InteractionStreamer --> |L2 interactions| Joiner
    Joiner -->|Interactions| RedisMapper
    RedisMapper -->|Messages| Duplicator
    Duplicator -->|Messages| RedisPublisher-0 
    Duplicator -->|Messages| RedisPublisher-1
```
