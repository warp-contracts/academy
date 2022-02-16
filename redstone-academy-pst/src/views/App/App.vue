<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  beforeMount() {
    this.loadState();
  },
  methods: {
    ...mapActions(['loadState']),
  },
};
</script>

<style lang="scss" src="./App.scss" />
