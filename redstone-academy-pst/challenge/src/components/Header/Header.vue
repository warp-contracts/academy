<template>
  <div>
    <h1 class="mt-3 mt-md-5">Contract</h1>
    <div>
      <span class="d-md-block d-none">{{ contractAddress }}</span
      ><span class="d-block d-md-none">{{ contractAddress | tx }}</span>
    </div>
    <div class="address-field">
      <div>Your address:</div>
      <div class="address-tx">
        <span class="d-md-block d-none">{{ walletAddress }}</span
        ><span class="d-block d-md-none">{{ walletAddress | tx }}</span>
      </div>
    </div>
    <input type="number" placeholder="Quantity" ref="balanceMint" />
    <button @click="mint" class="mint">Mint</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { deployedContracts } from '../../deployed-contracts';

export default Vue.extend({
  name: 'Header',
  methods: {
    async mint() {
      if (!this.$refs.balanceMint.value) {
        return;
      }
      this.$toasted.show('Processing...');
      const txId = null;
      const newResult = null;
      if (newResult) {
        this.$toasted.clear();
        this.$toasted.global.success('Processed!');
        this.$toasted.global.close(
          `<div>Interaction id: <a href="https://scanner.redstone.tools/#/app/interaction/${txId}" target="_blank">${txId}</a></div>`
        );
      }
      this.$parent.updateBalances(newResult);
      this.$refs.balanceMint = '';
    },
  },
  computed: {
    contractAddress() {
      return deployedContracts.fc;
    },
    ...mapState(['contract', 'arweave', 'walletAddress']),
  },
});
</script>

<style lang="scss" src="./Header.scss"></style>
