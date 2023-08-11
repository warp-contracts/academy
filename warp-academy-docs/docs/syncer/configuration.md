# Configuration

Syncer has a default configuration that works in local development (*src/utils/config)*. To overwrite it you can a json configuration file or ENV variables:


| Environment Variable | Description |
|---|---|
| SYNCER_IS_DEVELOPMENT | True for local development |
| SYNCER_REST_LISTEN_ADDRESS | Prometheus rest server address |
| SYNCER_STOP_TIMEOUT | Max time for stopping main task |
| SYNCER_LOG_LEVEL | Log level |
| SYNCER_ARWEAVE_NODE_URL | Arweave gateway url, default https://arweave.net |
| SYNCER_ARWEAVE_REQUEST_TIMEOUT | Max time for a request to arweave node |
| SYNCER_ARWEAVE_CHECK_PEER_TIMEOUT | Max time for peer to respond. Above this peer is considered unstable and is blacklisted |
| SYNCER_ARWEAVE_DIALER_TIMEOUT | Max time to dial  |
| SYNCER_ARWEAVE_DIALER_KEEP_ALIVE | TCP keep alive period |
| SYNCER_ARWEAVE_IDLE_CONN_TIMEOUT | Max time a connetion may be idle |
| SYNCER_ARWEAVE_TLS_HANDSHAKE_TIMEOUT | Max time for the TLS handshake |
| SYNCER_ARWEAVE_LIMITER_INTERVAL | Rate limiter interval |
| SYNCER_ARWEAVE_LIMITER_BURST_SIZE | Rate limiter burst size |
| SYNCER_ARWEAVE_LIMITER_DECREASE_FACTOR | Automatic modification of the rate limiter (not used for now) |
| SYNCER_ARWEAVE_LIMITER_DECREASE_INTERVAL | Automatic modification of the rate limiter (not used for now) |
| SYNCER_PEER_MONITOR_MAX_TIME_BLACKLISTED | Max time a peer may be blacklisted. After this time peer may be removed and rechecked. |
| SYNCER_PEER_MONITOR_MAX_PEERS_REMOVED_FROM_BLACKLIST | Max number of peers removed from the blacklist in one batch  |
| SYNCER_PEER_MONITOR_PERIOD | How often are peers monitored |
| SYNCER_PEER_MONITOR_MAX_PEERS | Max number of peers. Peers are used to vote for new blocks and for retrying requests |
| SYNCER_PEER_MONITOR_NUM_WORKERS | How many goroutines are used to send monitor requests to peers |
| SYNCER_PEER_MONITOR_WORKER_QUEUE_SIZE | Max numer of payloads stored in the worker queue before sending new one blocks |
| SYNCER_TRANSACTION_DOWNLOADER_NUM_WORKERS | Max number of workers used to download Arweave transactions |
| SYNCER_TRANSACTION_DOWNLOADER_WORKER_QUEUE_SIZE | Queue size for downloading Arweave transactions |
| SYNCER_NETWORK_MONITOR_PERIOD | How often is the /info endpoint requested |
| SYNCER_NETWORK_MONITOR_REQUIRED_CONFIRMATION_BLOCKS | Delay in Arweave block height that is emited |
| SYNCER_NETWORK_MONITOR_URL | Endpoint for requesting /info |
| SYNCER_SYNCER_BLOCK_MAX_ELAPSED_TIME | Max time to download an Arweave block |
| SYNCER_SYNCER_BLOCK_MAX_INTERVAL | Max time between retrying block download |
| SYNCER_SYNCER_TRANSACTION_MAX_ELAPSED_TIME | Max time to download Arweave transactions |
| SYNCER_SYNCER_TRANSACTION_MAX_INTERVAL | Max time between retrying transaction download |
| SYNCER_SYNCER_STORE_BATCH_SIZE | Batch size for when saving interactions to the database |
| SYNCER_SYNCER_STORE_MAX_TIME_IN_QUEUE | Max time an interaction may wait before being inserted to the database. This is used to minimize transaction number when synchronizing many blocks |
| SYNCER_SYNCER_STORE_MAX_BACKOFF_INTERVAL | Backoff interval when upon error when inserting interactions |
| SYNCER_BUNDLER_POLLER_DISABLED | Is the polling mechanizm switched on for getting new interactions for bundling |
| SYNCER_BUNDLER_POLLER_INTERVAL | How often does if check for new bundles in the database |
| SYNCER_BUNDLER_POLLER_TIMEOUT | How long does it wait for the query response |
| SYNCER_BUNDLER_POLLER_MAX_PARALLEL_QUERIES | Max queries that run in parallel |
| SYNCER_BUNDLER_POLLER_MAX_BATCH_SIZE | Maksimum number of interactions updated in the database in one db transaction  |
| SYNCER_BUNDLER_POLLER_RETRY_BUNDLE_AFTER |  Retry sending bundles to bundlr.network |
| SYNCER_BUNDLER_POLLER_MAX_DOWNLOADED_BATCH_SIZE | Maksimum number of interactions selected from the database in one db transaction |
| SYNCER_BUNDLER_WORKER_POOL_QUEUE_SIZE |  |
| SYNCER_BUNDLER_DB_POLLER_INTERVAL |  |
| SYNCER_BUNDLER_NOTIFIER_DISABLED | Is the notification mechanism switched on for getting new interactions for bundling |
| SYNCER_BUNDLER_NOTIFIER_WORKER_POOL_SIZE | Max number of workers that handle notifications |
| SYNCER_BUNDLER_NOTIFIER_WORKER_QUEUE_SIZE | Max number of notifications waiting in the queue |
| SYNCER_BUNDLER_CONFIRMER_BATCH_SIZE | How many batches are confirmet in one transaction. Many bundles may be marked in one db transaction. |
| SYNCER_BUNDLER_CONFIRMER_INTERVAL | How often are bundle states updated in the database |
| SYNCER_BUNDLER_CONFIRMER_BACKOFF_MAX_ELAPSED_TIME | Max time confirmer will try to insert a batch of data to the database. 0 means no limit |
| SYNCER_BUNDLER_CONFIRMER_BACKOFF_MAX_INTERVAL | Max time between retries to insert a batch of confirmations to  the database |
| SYNCER_BUNDLER_BUNDLER_NUM_BUNDLING_WORKERS | Number of workers that send bundles in parallel |
| SYNCER_BUNDLR_URLS | Node url of bundlr.network |
| SYNCER_BUNDLR_REQUEST_TIMEOUT | Request timeout to bundlr.network |
| SYNCER_BUNDLR_DIALER_TIMEOUT | Dial timeout |
| SYNCER_BUNDLR_DIALER_KEEP_ALIVE | TCP keep alive period |
| SYNCER_BUNDLR_IDLE_CONN_TIMEOUT | Idle connection timeout |
| SYNCER_BUNDLR_TLS_HANDSHAKE_TIMEOUT | TLS handshake timeout |
| SYNCER_BUNDLR_LIMITER_INTERVAL | Rate limiter interval to bundlr.network |
| SYNCER_BUNDLR_LIMITER_BURST_SIZE | Rate limitter burst size to bundlr.network |
| SYNCER_BUNDLR_WALLET | JWK walled used to sign bundles  |
| SYNCER_CHECKER_MIN_CONFIRMATION_BLOCKS | Minimum number of Arweave blocks to wait before checking if bundle is FINILIZED |
| SYNCER_CHECKER_MAX_BUNDLES_PER_RUN | Number of bundles to confirm in one run |
| SYNCER_CHECKER_WORKER_POOL_SIZE | Number of workers that check bundles in parallel |
| SYNCER_CHECKER_WORKER_QUEUE_SIZE | Queue size for checking bundles |
| SYNCER_CHECKER_POLLER_INTERVAL | How often db is polled for new bundles to check |
| SYNCER_CHECKER_POLLER_RETRY_CHECK_AFTER | After this time retry checking the bundle |
| SYNCER_DATABASE_PORT | Port of the read-write database |
| SYNCER_DATABASE_HOST | Host of the read-write database |
| SYNCER_DATABASE_USER | User for regular connection |
| SYNCER_DATABASE_PASSWORD | Password for regular connection |
| SYNCER_DATABASE_NAME | Name of the database |
| SYNCER_DATABASE_SSL_MODE | Postgres SSL mode |
| SYNCER_DATABASE_PING_TIMEOUT | Ping timeout |
| SYNCER_DATABASE_CLIENT_KEY | Client's key in plain text |
| SYNCER_DATABASE_CLIENT_KEY_PATH | Path to a file with client's key |
| SYNCER_DATABASE_CLIENT_CERT | Client certificate |
| SYNCER_DATABASE_CLIENT_CERT_PATH | Path to a file with client's certificate |
| SYNCER_DATABASE_CA_CERT | CA's certificate |
| SYNCER_DATABASE_CA_CERT_PATH | Path to CA's certificate |
| SYNCER_DATABASE_MIGRATION_USER | User used only for migrating database |
| SYNCER_DATABASE_MIGRATION_PASSWORD | Password for the migration user |
| SYNCER_DATABASE_MAX_OPEN_CONNS | Max number of open connections |
| SYNCER_DATABASE_MAX_IDLE_CONNS | Max number of idle connections |
| SYNCER_DATABASE_CONN_MAX_IDLE_TIME | How long connection may be idle |
| SYNCER_DATABASE_CONN_MAX_LIFETIME | Max time a connection may be established |
| SYNCER_CONTRACT_LOADER_WORKER_POOL_SIZE | Worker pool for fetching contact source and init state |
| SYNCER_CONTRACT_LOADER_WORKER_QUEUE_SIZE |  Maksimum payloads in loader's queue |
| SYNCER_CONTRACT_LOADER_SUPPORTED_CONTENT_TYPES | Possible contract source content types |
| SYNCER_CONTRACT_LOADER_BACKOFF_MAX_ELAPSED_TIME | Max time we try to download contract from arweave. 0 means no limit |
| SYNCER_CONTRACT_LOADER_BACKOFF_MAX_INTERVAL | Max time between retries to download contract tx |
| SYNCER_CONTRACT_LOADER_BACKOFF_ACCEPTABLE_DURATION | Acceptable duration for loading a single contract. After this time arweave client will be reset |
| SYNCER_CONTRACT_TRANSACTION_MAX_ELAPSED_TIME | Max time for a transaction to be downloaded. 0 means no limit |
| SYNCER_CONTRACT_TRANSACTION_MAX_INTERVAL |  Max time between transaction download retries |
| SYNCER_CONTRACT_STORE_BATCH_SIZE | How many contracts are saved in one transaction |
| SYNCER_CONTRACT_STORE_INTERVAL | How often is an insert triggered |
| SYNCER_CONTRACT_STORE_BACKOFF_MAX_ELAPSED_TIME | Max time store will try to insert a batch of data to the database |
| SYNCER_CONTRACT_STORE_BACKOFF_MAX_INTERVAL | Max time between retries to insert a batch of contracts to the database |
| SYNCER_CONTRACT_PUBLISHER_MAX_MESSAGE_SIZE | Max size of a message that can be published to Redis, in bytes. 10MB by default |
| SYNCER_CONTRACT_PUBLISHER_REDIS_CHANNEL_NAME | Saved contracts are published on this Redis channel |
| SYNCER_CONTRACT_PUBLISHER_APP_SYNC_CHANNEL_NAME | Saved contracts are published on this AppSync channel |
| SYNCER_REDIS | Array of redis connection configurations |
| SYNCER_APP_SYNC_TOKEN | Security token for AppSync |
| SYNCER_APP_SYNC_URL | URL of the AppSync endpoint |
| SYNCER_APP_SYNC_MAX_WORKERS | Number of workers that send GQL requests |
| SYNCER_APP_SYNC_MAX_QUEUE_SIZE | Max number of requests in worker's queue |
| SYNCER_APP_SYNC_BACKOFF_MAX_ELAPSED_TIME | Max time a request should be retried. 0 means no limit. |
| SYNCER_APP_SYNC_BACKOFF_MAX_INTERVAL | Max time between failed retries |
| SYNCER_FORWARDER_FETCHER_BATCH_SIZE |  How many L1 interactions are fetched from the DB at once |
| SYNCER_FORWARDER_PUBLISHER_REDIS_CHANNEL_NAME |  Interactions are saved to this Redis channel |
| SYNCER_FORWARDER_HEIGHT_DELAY | How long to wait before after receiving a new block height before sending L1 interactions. This delay ensures sequencer finishes handling requests in time |
| SYNCER_FORWARDER_ARWEAVE_FETCHER_QUEUE_SIZE | How many L1 interactions are cached in queue. This should be at least 1000 since this is how many tx are in Arweave block.|
| SYNCER_FORWARDER_ARWEAVE_FETCHER_BLOCK_SEND_TIMEOUT | How long to wait to send all L1 interactions from a given block. There's 2m between blocks, so this should be at most 2m |
| SYNCER_FORWARDER_INTERACTIONS_STREAMER_QUEUE_SIZE | How many L2 interactions are cached in queue. Those are L2 interactions streamed live from the database |
| SYNCER_GATEWAY_SERVER_LISTEN_ADDRESS |  REST API address |
| SYNCER_GATEWAY_SERVER_REQUEST_TIMEOUT |  Max time a http request can take |
