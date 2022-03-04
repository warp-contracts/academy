<template>
  <div>
    <div class="notification warning">
      Viewblock may display incorrect state because of caching and incorrect
      interactions ordering. See the
      <a
        :href="`${url.scanner}/#/app/contract/${deployedContracts.loot}#state`"
        target="_blank"
        >latest and correct state in our Scanner</a
      >
    </div>

    <div v-if="address" class="address-container notification">
      Your address:
      <a :href="`${url.viewblock}/arweave/address/${address}`" target="_blank">
        {{ address }}
      </a>
    </div>

    <div v-if="notificationText" class="notification">
      {{ notificationText }}

      <a
        v-if="notificationLink == 'download-arconnect'"
        target="_blank"
        href="https://chrome.google.com/webstore/detail/arconnect/einnioafmpimabjcddiinlhmijaionap"
      >
        Download ArConnect for Chrome
      </a>

      <a
        v-if="notificationLink == 'connect-wallet'"
        href="javascript:void(0)"
        @click="connectToArconnect()"
      >
        Connect to wallet
      </a>
    </div>
    <div v-if="sendingTx">
      <vue-loaders-ball-beat color="gray" scale="1"></vue-loaders-ball-beat>
    </div>

    <div v-if="sent" class="tx-sending notification">
      Your transaction has been sent. Please wait for about 20 minutes for it to
      be confirmed. To monitor your transaction's status click
      <a :href="`${url.arweaveNet}/tx/${txId}`" target="_blank">here</a>. You
      can close this page and come back any time. It also shoud appear in
      <a
        :href="`${url.scanner}/#/app/contract/${deployedContracts.loot}`"
        target="_blank"
      >
        Scanner
      </a>
      in about 20 minutes
    </div>

    <div v-if="walletLoaded" class="generate-button-container">
      <v-btn outlined width="450" @click="generateLoot()">
        Generate your loot
      </v-btn>
    </div>

    <div v-if="walletLoaded" class="my-assets">
      <h2>My assets</h2>
      <div
        v-if="!loadingAssets && myAssets && myAssets.length == 0"
        class="notification"
      >
        You don't own any assets yet. Click the "generate" button above to
        generate a new one.
      </div>
      <div v-if="walletLoaded && loadingAssets">
        <vue-loaders-ball-beat color="gray" scale="1"></vue-loaders-ball-beat>
      </div>
      <Assets
        v-if="walletLoaded && !loadingAssets"
        :includeAssets="myAssets"
        :allowTransfer="true"
      />
    </div>

    <div class="transactions" v-if="walletLoaded && address && !loadingAssets">
      <h2>My transactions</h2>
      <p class="small-notice">
        You may notice that some of your transactions failed. It's an expected
        behaviour. When you generate a new asset a random asset is selected. The
        selected asset may already be owned by another owner. In this case you
        don't get any assets. This means that the more assets are already
        generated, the more dificult is to get a new one.
      </p>
      <div v-if="loadingTransactions">
        Loading transactions...
      </div>
      <div
        v-for="transaction in userTransactions"
        :key="transaction.id"
        class="transaction"
      >
        <div class="transaction-id">
          <a
            target="_blank"
            :href="`${url.scanner}/#/app/interaction/${transaction.id}`"
          >
            {{ transaction.id }}
          </a>
        </div>
        <div class="transaction-status">
          <div v-if="transaction.status == 'success'" style="color: green">
            {{ transaction.status }}
          </div>
          <div v-else style="color: black">
            {{ transaction.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Assets from '@/components/Assets.vue';
import { mapState, mapActions } from 'vuex';
import item from '@/components/Asset.vue';
import { run } from 'ar-gql';
import deployedContracts from '@/deployed-contracts.json';
import { url } from '@/constants.js';

const LAST_BLOCKS_TO_CHECK = 30000;

export default {
  name: 'AssetsPage',

  data() {
    return {
      walletLoaded: false,
      arConnectInstalled: !!window.arweaveWallet,
      address: '',
      loadingTransactions: false,
      item,
      items: Array.from(Array(1000).keys()).map((i) => ({
        id: i,
        color: i,
      })),
      sendingTx: false,
      sent: false,
      userTransactionIds: [],
      url,
      deployedContracts,
      txId: null,
    };
  },

  timers: {
    checkArConnect: {
      time: 100,
      autostart: true,
      immediate: true,
      repeat: true,
    },
  },

  mounted() {
    this.loadUserTransactions();
  },

  methods: {
    ...mapActions(['loadState']),

    checkArConnect() {
      this.arConnectInstalled = !!window.arweaveWallet;
      if (this.arConnectInstalled) {
        this.connectToArconnect();
        this.$timer.stop('checkArConnect');
      }
    },

    async loadUserTransactions() {
      if (this.address) {
        this.loadingTransactions = true;
        const networkInfo = await this.arweave.network.getInfo();

        const minBlock = networkInfo.height - LAST_BLOCKS_TO_CHECK;

        const query = `
        {
          transactions(
            tags: [
              { name: "Contract", values: "${this.deployedContracts.loot}" }
              { name: "App-Name", values: "SmartWeaveAction" }
            ]
            block: { min: ${minBlock} }
            owners: ["${this.address}"]
            first: 100
          ) {
            edges {
              node {
                tags {
                  name
                  value
                }
                id
              }
            }
          }
        }`;

        const res = (await run(query)).data.transactions.edges;

        this.loadingTransactions = false;

        this.userTransactionIds = res.map((el) => el.node.id);
        // {
        //   const id = 
        //   const status = this.validity[id] ? 'success': 'error'
        //   return { id, status }
      }
    },

    async generateLoot() {
      console.log('Sending transaction');
      this.sendingTx = true;
      this.txId = await this.contract.writeInteraction({
        function: 'generate',
      });
      this.sendingTx = false;

      this.sent = true;
    },

    async connectToArconnect() {
      console.log('Connecting to ArConnect');
      if (window.arweaveWallet) {
        window.addEventListener('walletSwitch', async (e) => {
          console.log('walletSwitch', e);
          this.walletLoaded = true;
          this.loadArweaveAddress();
        });
        window.addEventListener('arweaveWalletLoaded', async (e) => {
          console.log('arweaveWalletLoaded', e);
          this.walletLoaded = true;
          this.loadArweaveAddress();
        });

        try {
          await this.loadArweaveAddress();
        } catch (e) {
          console.error(e);
          if (!this.address) {
            console.warn('Failed to get address. Connecting to ArConnect');
            await window.arweaveWallet.connect([
              'ACCESS_ADDRESS',
              'ACCESS_ALL_ADDRESSES',
              'SIGN_TRANSACTION',
            ]);
            await this.loadArweaveAddress();
          }
        }
      }
    },

    async loadArweaveAddress() {
      if (!window.arweaveWallet) {
        throw new Error('Can not get address without arweaveWallet');
      } else {
        this.address = await window.arweaveWallet.getActiveAddress();
        this.walletLoaded = true;
      }
    },
  },

  computed: {
    ...mapState(['state', 'validity', 'contract', 'loadingAssets', 'arweave']),

    myAssets() {
      if (!this.state.assets) {
        return [];
      }
      const result = [];
      for (const [name, owner] of Object.entries(this.state.assets)) {
        if (owner && owner === this.address) {
          result.push({
            name,
            owner,
          });
        }
      }
      return result;
    },

    userTransactionsCount() {
      if (!this.address) {
        return 0;
      } else {
        return this.userTransactions.length;
      }
    },

    userTransactions() {
      if (this.userTransactionIds && this.userTransactionIds.length > 0) {
        return this.userTransactionIds.map((id) => ({
          id,
          status: this.validity[id] ? 'success' : 'error',
        }));
      } else {
        return [];
      }
    },

    notificationText() {
      if (!this.walletLoaded) {
        return 'Please connect your ArConnect wallet to this app for being able to see your loots and generate new loots.';
      } else {
        return '';
      }
    },

    notificationLink() {
      if (this.arConnectInstalled) {
        return 'connect-wallet';
      } else {
        return 'download-arconnect';
      }
    },
  },

  watch: {
    address() {
      this.loadUserTransactions();
    },
  },

  components: {
    Assets,
  },
};
</script>

<style lang="scss">
a {
  color: black;

  &:hover {
    color: #0f9d58;
  }
}
</style>

<style scoped lang="scss">
.my-assets {
  margin-top: 30px;
  h2 {
    margin-bottom: 10px;
  }
}

.notification {
  width: 450px;
  border-radius: 3px;
  border: 1px solid #ddd;
  text-align: left;
  margin: 10px auto;
  padding: 16px;
  font-size: 14px;
  font-weight: 400;
}

.address-container {
  text-align: center;
  font-size: 12px;
}

.transactions {
  margin: 30px auto;

  h2 {
    margin-bottom: 20px;
  }

  .small-notice {
    width: 450px;
    margin: 20px auto;
    text-align: left;
    font-size: 14px;
  }

  .transaction {
    text-align: left;
    padding: 5px 10px;
    margin-top: 20px;
    width: 450px;
    display: grid;
    grid-template-columns: 300px auto;
    margin: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 10px;
    margin-bottom: 10px;

    .transaction-status {
      text-align: right;
    }
  }
}
</style>
