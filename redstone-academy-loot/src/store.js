import Vue from 'vue';
import Vuex from 'vuex';
import contract, { arweave } from './loot-smartweave-contract';
import { url } from './constants';
import deployedContracts from '@/deployed-contracts.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    contract,
    arweave,
    state: {},
    validity: {},
    loadingAssets: false,
  },
  mutations: {
    setState(state, swState) {
      state.state = swState;
    },

    setValidity(state, validity) {
      state.validity = validity;
    },

    setLoadingAssets(state, val) {
      state.loadingAssets = val;
    },
  },
  actions: {
    async loadState({ commit }) {
      commit('setLoadingAssets', true);
      const { state, validity } = await fetch(
        `${url.cache}/cache/state/${deployedContracts.loot}`
      ).then((res) => res.json());
      commit('setState', state);
      commit('setLoadingAssets', false);
      commit('setValidity', validity);
    },
  },
});
