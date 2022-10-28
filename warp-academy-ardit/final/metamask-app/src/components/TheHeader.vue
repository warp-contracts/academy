<script setup>
import { useContractStore } from '../stores/contract';
const store = useContractStore();
</script>

<template>
  <header>
    <h1 class="app-title">Ardit</h1>
    <h2 class="contract-id">
      <p>Contract id:</p>
      <a
        target="_blank"
        :href="`https://sonar.warp.cc/#/app/contract/${store.contractId}`"
      >
        {{ store.contractId }}
      </a>
    </h2>
  </header>
</template>

<style scoped lang="scss">
@import '../style/_colors';
header {
  width: 100%;
  height: 6rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-top: 5rem;
  background-color: $background;

  .app-title {
    font-size: 2.2rem;
    color: $white;
  }
  .contract-id {
    display: flex;
    flex-direction: row;

    margin-top: 1rem;
    color: $white;
    p {
      font-size: 1.2rem;
    }
    a {
      font-size: 1.2rem;
      margin-left: 1rem;
      color: $white;
    }
  }
}
</style>
