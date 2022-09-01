import Vue from 'vue';
import Vuex from 'vuex';
import { arweave, warp } from '../environment';
import { deployedContracts } from '../deployed-contracts';
import { PstState } from '@/contracts/types/types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    warp,
    state: {},
    contract: null,
    walletAddress: null,
  },
  mutations: {
    setState(state, swState) {
      state.state = swState;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setWalletAddress(state, walletAddress) {
      state.walletAddress = walletAddress;
    },
  },
  actions: {
    async loadState({ commit }) {
      // ~~ Generate arweave wallet ~~
      const wallet = null;

      // ~~ Get wallet address and mint some tokens ~~
      const walletAddress = null;

      // ~~ Connect deployed contract and wallet ~~
      const contract = null;
      commit('setContract', contract);

      // ~~ Set the state of the contract ~~
      const state = null;
      commit('setState', state);
      commit('setWalletAddress', walletAddress);
    },
  },
  modules: {},
});
