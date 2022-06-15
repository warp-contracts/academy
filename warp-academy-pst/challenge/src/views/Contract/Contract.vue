<template>
  <div class="home">
    <Header />
    <BalancesList :balances="balances" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header/Header.vue';
import BalancesList from '@/components/BalancesList/BalancesList.vue';

import { mapState } from 'vuex';

export default Vue.extend({
  name: 'Contract',
  components: {
    Header,
    BalancesList,
  },
  data() {
    return {
      balances: [],
    };
  },
  watch: {
    state: function () {
      this.state && this.updateBalances(this.state);
    },
  },
  methods: {
    updateBalances(state: any) {
      let stateBalances = Object.keys(state.balances).map((key) => [
        key,
        state.balances[key],
      ]);
      stateBalances.reverse().forEach((b, index) => {
        Vue.set(this.balances, index, {
          address: b[0],
          balance: b[1],
        });
      });
    },
  },
  computed: {
    ...mapState([
      'state',
      'validity',
      'contract',
      'arweave',
      'warp',
      'walletAddress',
    ]),
  },
});
</script>

<style lang="scss">
.home {
  width: 70%;
  margin: 0 auto;

  @media only screen and (max-width: 1024px) {
    width: 90%;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>
