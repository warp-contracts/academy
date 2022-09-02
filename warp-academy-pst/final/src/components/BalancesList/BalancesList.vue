<template>
  <div>
    <div v-show="!loaded" class="loader">
      <pacman-loader :loading="!loaded" :color="color"></pacman-loader>
    </div>
    <ul>
      <li
        v-for="(balance, index) in balances"
        :key="balance.address"
        class="balances-list mt-3 mt-md-0"
        v-bind:class="{ active: balance.address == walletAddress }"
      >
        <div class="address">
          <span class="d-none d-lg-block">{{ balance.address }}</span
          ><span class="d-block d-lg-none">{{ balance.address | tx }}</span>
        </div>
        <div class="balance">
          {{ balance.balance }} <img class="img-fc" src="../../assets/fc.png" />
        </div>
        <input
          type="number"
          ref="balanceTransfer"
          v-model="balance.value"
          placeholder="Quantity"
          :disabled="balance.address == walletAddress"
        />

        <button @click="transfer(balance.address, balance.value, index)">
          Transfer
        </button>
        <div></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';

export default Vue.extend({
  name: 'BalancesList',
  props: {
    balances: Array,
  },
  data() {
    return {
      color: '#c0fdff',
      loaded: false,
    };
  },
  components: {
    PacmanLoader,
  },
  watch: {
    balances: function () {
      this.loaded = !!this.balances;
    },
  },
  methods: {
    async transfer(address: string, qty: string) {
      if (!qty) {
        return;
      }
      if (!this.balances[this.userIdx]) {
        this.$toasted.error(
          'Your balance is not enough to transfer tokens. Please mint some FC first.',
          { duration: 3000 }
        );
        this.$refs['balanceTransfer'].value = '';
        return;
      }
      this.$toasted.show('Processing...');
      const {originalTxId: txId} = await this.contract.transfer({
        target: address,
        qty: parseInt(qty),
      });
      let newResult = await this.contract.currentState();
      if (newResult) {
        this.$toasted.clear();
        this.$toasted.global.success('Processed!');
        this.$toasted.global.close(
          `<div>Interaction id: <a href="https://sonar.warp.cc/#/app/interaction/${txId}" target="_blank">${txId}</a></div>`
        );
      }
      this.$parent.updateBalances(newResult);
    },
  },
  computed: {
    userIdx() {
      return this.balances.findIndex((b) => b.address == this.walletAddress);
    },
    ...mapState(['state', 'contract', 'arweave', 'walletAddress']),
  },
});
</script>

<style lang="scss" src="./BalancesList.scss" scoped></style>
