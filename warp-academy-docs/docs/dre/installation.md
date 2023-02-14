# Installation & running
## Docker compose (bare metal)

### TL;DR

0. `git clone git@github.com:warp-contracts/warp-dre-node.git`
1. `cp .env.defaults .env`
2. Edit .env file and set all [required variables](#environment-variables).
3. docker compose up -d

### Pre requirements

1. You need to have docker installed on your local machine with docker compose. You can
   use [docker-desktop](https://www.docker.com/products/docker-desktop/).
2. You need to have Arweave wallet. You can generate it using:
   1. [arweave wallet](https://arweave.app/add). You can download the wallet using the download button in
      the [wallet setting](https://arweave.app/settings).
   2. Generate a new wallet using script: `mkdir .secrets && yarn generate-arweave-wallet`
   3. Script will generate arweave keys, you should past JSON string in `NODE_JWK_KEY` env variable in `.env` file
   > ⚠️ Don't use wallets with real funds for test/development proposes.
3. (Optional) [NodeJS](https://nodejs.org/en/download/)
4. (Optional) [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

### Running

To run docker compose you need to set up correct [environment variables](#environment-variables).
You can do it using .env file:

```shell
cp .env.defaults .env
```

The file .env.example contains variables you can configure)
or [any other way supported by docker compose](https://docs.docker.com/compose/envvars-precedence/).

When you set up all required environment variables, just run:

```shell
docker compose up -d
```

## Hosting specific setup

### AWS (EC2)

#### Create EC2 instance
1. Choose Debian 11 AMI (you can choose any system you prefer)
2. Instance type
   1. t3.micro for test proposes
   2. t3.medium or bigger for production
3. Key pair (login)
   1. Create new key pair
   2. Download key pair and save it in safe place. You will need it to login to the instance after creation
4. Network settings:
   1. Set flag: "Allow HTTP traffic from the internet"
5. Storage: 60Gb, gp2
6. Advanced details -> User data -> Paste content to install docker and D.R.E.:

```shell
#!/bin/bash -ex
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo BEGIN
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker admin
cd /home/admin
git clone https://github.com/warp-contracts/warp-dre-node.git
cp warp-dre-node/.env{.defaults,}
sudo chown -R admin warp-dre-node 
echo END
```

#### Configure the instance and run D.R.E. node

1. Wait until instance is created and initialized. You can check status in EC2 console in the "Status Checks" section
2. Login to the instance using SSH
   1. Open terminal
   2. Run `chmod 400 <path_to_key_pair_file>` to set correct permissions to the key pair file
   3. Run `ssh -i <path_to_key_pair_file> admin@<instance_public_ip>`
3. Check if you have access to docker: `docker ps`. Check /var/log/user-data.log in case it's not accessible
4. Go to warp-dre-node directory: `cd ~/warp-dre-node`
5. Set all [required variables](#environment-variables): `nano .env`
   1. ENV - change to prod, if you run D.R.E. node in production mode
   2. NODE_JWK_KEY - paste your arweave wallet JSON string. Creation of the wallet is described in the [pre requirements](#pre-requirements) section
6. Run `docker compose up -d` to start D.R.E. node
7. Check if containers started successfully: `docker ps`
8. Check if D.R.E. node is running: go to `http://<instance ip>/status`

### GCP

1. Choose Debian 11 AMI (you can choose any system you prefer)
2. Instance type
   1. e2-small for test proposes
   2. e2-standard-2 or bigger for production
3. Firewall:
   1. Set flag: "Allow HTTP traffic"
4. Storage: 60Gb, gp2
5. Advanced options
   1. Disk - add additional disk - 60Gb
   2. Managenent -> Automation -> Paste content to install docker and D.R.E.:

```shell
#!/bin/bash -ex
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo BEGIN
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo useradd -g docker -s /bin/bash -m dre

cd /home/dre
git clone https://github.com/warp-contracts/warp-dre-node.git
cp warp-dre-node/.env{.defaults,}
sudo chown -R dre warp-dre-node 
echo END
```

#### Configure the instance and run D.R.E. node

1. Wait until instance will be in the running state
2. Login to the instance using SSH (you can do it in the GCP console)
3. Login to dre user: `sudo su dre`
4. Check if you have access to docker: `docker ps`. Check /var/log/user-data.log in case it's not accessible
5. Go to warp-dre-node directory: `cd ~/warp-dre-node`
6. Set all [required variables](#environment-variables): `nano .env`
   1. ENV - change to prod, if you run D.R.E. node in production mode
   2. NODE_JWK_KEY - paste your arweave wallet JSON string. Creation of the wallet is described in the [pre requirements](#pre-requirements) section
7. Run `docker compose up -d` to start D.R.E. node
8. Check if containers started successfully: `docker ps`
9. Check if D.R.E. node is running: go to `http://<instance ip>/status`


### DigitalOcean

**Create droplet**

1. Choose Debian 11 as OS 
2. Instance type
   1. Basic -> Regular -> 1Gb/1CPU instance - for test proposes
   2. General propose -> 8 GB/2 CPUs or bigger for production
3. Enable backups (optional)
4. Advanced options -> Add Initialization scripts -> Paste content to install docker and D.R.E.:

```shell
#!/bin/bash -ex
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo BEGIN
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo useradd -g docker -s /bin/bash -m dre

cd /home/dre
git clone https://github.com/warp-contracts/warp-dre-node.git
cp warp-dre-node/.env{.defaults,}
sudo chown -R dre warp-dre-node 
echo END
```

#### Configure the instance and run D.R.E. node

1. Login to the instance
2. Login to dre user: `sudo su dre`
3. Check if you have access to docker: `docker ps`. Check /var/log/user-data.log in case it's not accessible
4. Go to warp-dre-node directory: `cd ~/warp-dre-node`
5. Set all [required variables](#environment-variables): `nano .env`
   1. ENV - change to prod, if you run D.R.E. node in production mode
   2. NODE_JWK_KEY - paste your arweave wallet JSON string. Creation of the wallet is described in the [pre requirements](#pre-requirements) section
6. Run `docker compose up -d` to start D.R.E. node
7. Check if containers started successfully: `docker ps`
8. Check if D.R.E. node is running: go to `http://<instance ip>/status`

## Kubernetes (Helm)

Create secret:
```shell
kubectl create secret generic dre --from-env-file=.env
```

Install/update helm chart:
```shell
helm upgrade --install warp-dre-node ./helm
```


## Environment variables

We configure D.R.E. using [dotenv](https://github.com/motdotla/dotenv#usage). It means we can modify the configuration
using environment variables or .env file.

You can check out the default values in the .env.defaults file.

| Variable                | Required                 | Description                                                                                                  |
|-------------------------|--------------------------|--------------------------------------------------------------------------------------------------------------|
| APPSYNC_PUBLISH_STATE   | true                     | Publish state into the appsync. Requires non-empty APPSYNC_KEY.                                              |
| APPSYNC_KEY             | true/false               | [AWS AppSync](https://aws.amazon.com/appsync/) key.                                                          |
| NODE_JWK_KEY            | true                     | JWK key of Arweave wallet. See more in [Pre requirements](#Pre-requirements) section.                        |
| PUBSUB_TYPE             | true                     | Transport for node pub/sub. The node gets information about new blocks with it. Can be `streamr` or `redis`. |
| STREAMR_STREAM_ID       | if PUBSUB_TYPE=`streamr` | Required when PUBSUB_TYPE is streamr. Streamr stream id                                                      |
| GW_PORT                 | if PUBSUB_TYPE='redis'   | Port to Redis pubsub instance                                                                                |
| GW_HOST                 | if PUBSUB_TYPE='redis'   | Host to Redis pubsub instance                                                                                |
| GW_USERNAME             | if PUBSUB_TYPE='redis'   | Username for authenticating to Redis pubsub instance                                                         |
| GW_PASSWORD             | if PUBSUB_TYPE='redis'   | Password for authenticating to Redis pubsub instance                                                         |
| GW_TLS                  | if PUBSUB_TYPE='redis'   | TLS enabled/disabled for Redis pubsub instance                                                               |
| GW_ENABLE_OFFLINE_QUEUE | if PUBSUB_TYPE='redis'   | https://luin.github.io/ioredis/interfaces/CommonRedisOptions.html#enableOfflineQueue                         |
| GW_LAZY_CONNECT         | if PUBSUB_TYPE='redis'   | https://luin.github.io/ioredis/interfaces/CommonRedisOptions.html#lazyConnect                                |


## Build docker image

Dev image (default platform)

Build dev tag image

```shell
docker buildx bake
```

Build image with custom tag:

```shell
TAG=myCustomTag docker buildx bake
```

If you want to build multiplatform images:

```shell
docker buildx create --name multibuilder
docker buildx use multibuilder
```
