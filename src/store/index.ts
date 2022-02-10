import { Contract } from 'redstone-smartweave';
import Vue from 'vue';
import Vuex from 'vuex';
import { arweave, smartweave } from '../pst-contract';
import { deployedContracts } from '../deployed-contracts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    smartweave,
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
      await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
      // Interacting with the contract
      const contract: Contract = smartweave
        .pst(deployedContracts.fc)
        .connect(wallet);
      commit('setContract', contract);
      const { state, validity } = await contract.readState();
      commit('setState', state);
      commit('setValidity', validity);
      commit('setWalletAddress', walletAddress);
    },
  },
  modules: {},
});
