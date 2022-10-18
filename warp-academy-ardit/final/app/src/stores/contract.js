import { defineStore } from 'pinia';
import { WarpFactory } from 'warp-contracts/web';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { createToast } from 'mosha-vue-toastify';
import { contractId } from '../constants.js';
import MetaMaskOnboarding from '@metamask/onboarding';
import * as B64js from "base64-js";

const { isMetaMaskInstalled } = MetaMaskOnboarding;

console.log("Metamask: " + isMetaMaskInstalled());

//TODO: Move to UTILS (taken from arweave-js utils.ts)
function b64UrlEncode(b64UrlString) {
  return b64UrlString
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function bufferTob64(buffer) {
  return B64js.fromByteArray(new Uint8Array(buffer));
}

function bufferTob64Url(buffer) {
  return b64UrlEncode(bufferTob64(buffer));
}

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));


const encodeTxId = async function(signature) {
  let hash = await crypto.subtle.digest("sha-256", fromHexString(signature));
  return bufferTob64Url(new Uint8Array(hash));
}


//Main logic
const evmSignature = async (tx) => {

  //Loading accounts from Metamask
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  console.log("Connected account: " + accounts[0]);

  //Setup owner as the metamask account which signed the message
  tx.owner = accounts[0];

  //Adding tag that marks the different signature schema
  //TODO: Switch from btoa to proper Base64 encoding
  tx.tags.push({
    name: btoa("Signature-schema"), 
    value: btoa("EVM")
  });

  //Requesting signature
  tx.signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [accounts[0], JSON.stringify(tx)],
  });
  console.log("Signature: " + tx.signature);
  

  //Setting tx.id -> to be consistent with arweave-js specification which states that
  //tx.id = sha-256(signature)
  //TODO: Abstract the crypto interface to be consistent with Node.js
  //Currently it's based on the subtle crypto from arweave-js
  tx.id = await encodeTxId(tx.signature);

  
  
  console.log(tx);
  return tx;
};

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
      this.warp = await WarpFactory.forMainnet();
    },

    async getContract() {
      this.contract = await this.warp.contract(this.contractId);
      const { cachedValue } = await this.contract.readState();
      this.contractState = cachedValue.state;
    },

    async connectWallet() {
      let arweaveWebWallet = new ArweaveWebWallet({
        name: 'Ardit',
      });
      await arweaveWebWallet.setUrl('arweave.app');
      await arweaveWebWallet.connect();
      this.wallet = arweaveWebWallet;
      await this.contract.connect('use_wallet');
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
          await this.contract.connect('use_wallet').writeInteraction({
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
        await this.contract.connect(evmSignature).writeInteraction({
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
