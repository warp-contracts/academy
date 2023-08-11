
# Development

## Getting started

We use `make` for building. To generate binaries simply clone the repository and run  `make` in the root directory. Some basic commands:

```sh
# Build and lint
make

# Build with race condition detection
make build-race

# Run linter
make lint

# Run tests
make test
```

## Local development

Setting up a local dev environment for the first time:

```sh
# Start all needed services
docker-compose up -d 

# Dump the database (only schema is needed) and save it locally
pg_dump -h ... -U ... ... | gzip > gateway_dump.gz
gunzip gateway_dump.gz
psql -U postgres -h 127.0.0.1 -p 7654 -d warp < gateway_dump

# Build and launch syncer (other commands are available in the Makefile)
make run
```

## Releases

Every release is built and pushed to dockerhub, e.g. `warpredstone/syncer:0.2.0`. The latest release is tagged as `warpredstone/syncer:latest`.

:::info
Running in docker is the recomended way of running Warp-Syncer services.
:::

Warp-Syncer is developed, tested and run on Linux. It should be possible to run it on Windows and Mac though.
