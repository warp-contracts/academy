<script setup>
import { ref } from 'vue';
import { useContractStore } from '../stores/contract';

let content = ref('');
const store = useContractStore();

const sendContent = async () => {
  if (content.value == '') {
    return;
  } else {
    await store.addContent(content.value);
    content.value = '';
    store.getContract();
  }
};
</script>

<template>
  <section>
    <div class="wallet-menu">
      <button class="connect-btn" @click="store.connectWallet()">CONNECT WALLET</button>
    </div>
    <form>
      <div class="form__group field">
        <input
          type="input"
          v-model="content"
          class="form__field"
          placeholder="Message"
          name="message"
          id="message"
          required
        />
        <label for="message" class="form__label">Message</label>
      </div>
      <button class="send-btn" @click.prevent="sendContent">Send</button>
    </form>
  </section>
</template>

<style scoped lang="scss">
@import '../style/_colors';

$primary: #11998e;
$white: #fff;
$gray: #9b9b9b;

section {
  width: 40rem;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  .wallet-menu {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5rem;

    .connect-btn {
      width: 60%;
      height: 5rem;
      background-color: $secondary;
      color: $white;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border: 1px solid $secondary;
        background-color: transparent;
      }
    }
  }
}

form {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .form__group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 100%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid $gray;
    outline: 0;
    font-size: 1.3rem;
    color: black;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: $gray;
  }

  .form__field:focus {
    ~ .form__label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: $primary;
      font-weight: 700;
    }
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, $primary, $secondary);
    border-image-slice: 1;
  }
  .form__field {
    color: $white;
    &:required,
    &:invalid {
      box-shadow: none;
    }
  }

  .send-btn {
    width: 10rem;
    height: 3rem;
    margin-top: 2rem;
    cursor: pointer;
    background-color: $contrast;
    color: $white;
    border: none;
    transition: background 0.2s ease;

    &:hover {
      background-color: $contrastHover;
    }
  }
}
</style>
