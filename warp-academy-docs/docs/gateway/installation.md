### Installation

1. `yarn install`
2. `yarn build`

### Running

To run gateway in production:

1. Create a file `.secrets/.env` with a `DB_URL` property with PostgreSQL connections string,
   eg: `DB_URL=postgresql://<user>:<password>@<db-host>:<db-port>/<database-name>`

2. Run gateway with `yarn start:prod`.  
   You can pass the `env_path` param with path to the `.env` file, eg:  
   `yarn start:prod --env_path .secrets/.env`

To run gateway locally:

1. Create a file `.secrets/local.env` with a `DB_URL` property with PostgreSQL connections string,
   eg: `DB_URL=postgresql://<user>:<password>@<db-host>:<db-port>/<database-name>`

2. Run gateway with `yarn start:local`.

### Running (Docker)

1. build the docker image - run script `docker-build.sh`
2. run the docker image - run script `docker-run.sh`
