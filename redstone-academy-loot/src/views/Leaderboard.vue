<template>
  <div>
    <div v-if="!loadingAssets">
      <div class="owners">
        <div v-for="owner in owners" :key="owner.address" class="owner">
          <div class="address">
            <a :href="getViewblockLink(owner.address)" target="_blank">
              {{ owner.address }}
            </a>
          </div>
          <div class="asset-count">
            owns
            <a :href="'/#/assets/' + owner.address">
              {{ owner.assetCount }} asset<span>{{
                owner.assetCount > 1 ? 's' : ''
              }}</span>
            </a>
          </div>
        </div>
      </div>
      <!-- {{ JSON.stringify(owners, null, 2) }} -->
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { url } from '@/constants.js';

export default {
  name: 'Leaderboard',
  computed: {
    ...mapState(['state', 'loadingAssets']),
    owners() {
      let result = [];
      const aggregated = {};
      if (!this.loadingAssets && this.state) {
        for (const [, owner] of Object.entries(this.state.assets)) {
          aggregated[owner] = (aggregated[owner] || 0) + 1;
        }
        result = Object.entries(aggregated)
          .map(([address, assetCount]) => ({ address, assetCount }))
          .sort((owner1, owner2) => owner2.assetCount - owner1.assetCount);
      }
      return result;
    },
  },
  methods: {
    getViewblockLink(address) {
      return `${url.viewblock}/arweave/address/${address}`;
    },
  },
};
</script>

<style scoped lang="scss">
.owners {
  width: 450px;
  margin: 10px auto;

  .owner {
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 15px;
    font-size: 11px;

    display: grid;
    grid-template-columns: auto auto;

    .address {
      text-align: left;
    }

    .asset-count {
      text-align: right;
    }
  }
}

pre {
  text-align: left;
  margin: auto;
}
</style>
