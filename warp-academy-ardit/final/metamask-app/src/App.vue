<template>
  <div>
    <div>
      <TheHeader></TheHeader>
    </div>
    <div class="wrapper">
      <MessageForm></MessageForm>
      <MessagesList></MessagesList>
    </div>
  </div>
</template>

<script setup>
import { useContractStore } from './stores/contract';
import TheHeader from './components/TheHeader.vue';
import MessageForm from './components/MessageForm.vue';
import MessagesList from './components/MessagesList.vue';

const store = useContractStore();

const init = async () => {
  await store.initWarp();
  await store.getContract();
};

init();
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,400;0,500;0,600;0,700;1,100;1,400;1,500;1,600;1,700&display=swap');
@import './style/colors';
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto Mono', monospace;
  font-size: 10px;
}

.wrapper {
  padding-top: 3rem;
  padding-left: 2rem;
  padding-right: 2rem;
  width: 100%;
  height: calc(100vh - 6rem);

  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: $background;
  overflow: hidden;
}
</style>
