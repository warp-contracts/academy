<template>
  <div>
    <div class="generated-assets">
      <h2>
        Assets of user:
        <a :href="getViewblockLink(userAddress)" target="_blank">
          {{ userAddress | short-address }}
        </a>
        ({{ assetsOfUser.length }})
      </h2>
      <div v-if="loadingAssets">
        <vue-loaders-ball-beat color="gray" scale="1"></vue-loaders-ball-beat>
      </div>
      <Assets
        v-else
        :showNotGeneratedAssets="false"
        :includeAssets="assetsOfUser"
        :excludeAssets="[]"
      />
    </div>
  </div>
</template>

<script>
import Assets from '@/components/Assets.vue';
import { mapState } from 'vuex';
import { url } from '@/constants.js';

export default {
  name: 'AssetsOfUser',

  data() {
    return {
      loadedAssets: {},
    };
  },

  computed: {
    ...mapState(['state', 'validity', 'loadingAssets']),
    assetsOfUser() {
      if (this.state.assets && this.userAddress) {
        return Object.entries(this.state.assets)
          .map(([name, owner]) => ({
            name,
            owner,
          }))
          .filter((asset) => asset.owner === this.userAddress);
      }
      return [];
    },

    userAddress() {
      return this.$route.params.owner;
    },
  },

  methods: {
    getViewblockLink(address) {
      return `${url.viewblock}/arweave/address/${address}`;
    },
  },

  components: {
    Assets,
  },
};
</script>

<style>
label.v-label {
  left: 10px !important;
  top: 1px;
}
</style>

<style lang="scss" scoped>
.checkbox-container {
  margin: auto;
  margin-top: 10px;
  border: 1px solid #ddd;
  width: 280px;
  padding-left: 20px;
  padding-right: 20px;
  transform: scale(0.8);
  border-radius: 3px;
}

.line-container {
  hr {
    max-width: 80vw;
    margin: auto;
    margin-top: 40px;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #ddd;
  }
}
</style>
