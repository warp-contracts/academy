import { Contract } from 'warp-contracts';
import Vue from 'vue';
import Vuex from 'vuex';
import { arweave, warp } from '../environment';
import { deployedContracts } from '../deployed-contracts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    warp,
    state: {},
    validity: {},
    contract: null,
    walletAddress: null,
  },
  mutations: {
    setState(state, swState) {
      state.state = swState;
    },

    setValidity(state, validity) {
      state.validity = validity;
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
      const wallet = await arweave.wallets.generate();
      const walletAddress = await arweave.wallets.getAddress(wallet);

      // Interacting with the contract
      const contract: Contract = warp
        .pst(deployedContracts.fc)
        .connect(wallet);

      commit('setContract', contract);
      const { cachedValue } = await contract.readState();
      commit('setState', cachedValue.state);
      commit('setValidity', cachedValue.validity);
      commit('setWalletAddress', walletAddress);
    },
  },
  modules: {},
});
