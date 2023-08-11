# Internals

Warp-Syncer is a collection of services, each implemented as a command in one Golang binary. Internally all those services are a collection of `Tasks` connected by Golang channels.


## Tasks
`Task` is our internal abstraction for a unit of work. A Task manages its own state, spawns goroutines, receives data from input channels and sends data to output channels. 

:::info
For example there's `TransactionDownloader` task that gets Arweave transactions from one block. It has an input channel where it receives new blocks, and an output channel where it sends transactions. It downloads transactions in parallel using a pool of goroutines.

Tasks are the building blocks of any Warp-Syncer service. They are set up in `controller.go` in each service's folder. Tasks are embeddable - a task can be used as a building block for another task. For example the entry point of the application is a `Task` that spawns other tasks and connects them together.

:::info
`Task` primitives are defined in `./src/utils/task/*.go` files.
:::
