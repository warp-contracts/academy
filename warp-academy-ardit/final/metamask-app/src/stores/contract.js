import { defineStore } from 'pinia';
import { WarpFactory } from 'warp-contracts/web';
// import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { createToast } from 'mosha-vue-toastify';
import { contractId } from '../constants.js';
import { evmSignature, EvmSignatureVerificationPlugin } from 'warp-signature';
import MetaMaskOnboarding from '@metamask/onboarding';

export const useContractStore = defineStore('contract', {
  state: () => {
    return {
      contractState: [],
      contractId: contractId,
      messages: [],
      warp: null,
      contract: null,
      wallet: null,
    };
  },
  actions: {
    async initWarp() {
      this.warp = await WarpFactory.forMainnet().use(new EvmSignatureVerificationPlugin());
    },

    async getContract() {
      this.contract = await this.warp.contract(this.contractId);
      const { cachedValue } = await this.contract.readState();
      this.contractState = cachedValue.state;
    },

    async connectWallet() {
      if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
        createToast('Wallet not detected. Please install Metamask.', {
          type: 'danger',
        });
        return;
      }

      await this.contract.connect({
        signer: evmSignature,
        signatureType: 'ethereum',
      });
      createToast('Conntected!', {
        type: 'success',
      });
    },

    async voteInteraction(functionType, message) {
      try {
        if (message.votes.addresses.includes(this.wallet.address)) {
          createToast('Already voted!', {
            type: 'danger',
          });
        } else if (message.creator == this.wallet.address) {
          createToast(`You can't vote on your own content!`, {
            type: 'danger',
          });
        } else {
          await this.contract
            .connect({
              signer: evmSignature,
              signatureType: 'ethereum',
            })
            .writeInteraction({
              function: functionType,
              id: message.messageId,
            });
          createToast('Voted!', {
            type: 'success',
          });
          this.getContract();
        }
      } catch (error) {
        console.log(error);
        createToast('Wallet not connected!', {
          type: 'danger',
        });
      }
    },

    async addContent(payload) {
      try {
        await this.contract
          .connect({
            signer: evmSignature,
            signatureType: 'ethereum',
          })
          .writeInteraction({
            function: 'postMessage',
            content: payload,
          });
      } catch (error) {
        console.log(error);
        createToast('Wallet not connected!', {
          type: 'danger',
        });
      }
    },
  },
});
