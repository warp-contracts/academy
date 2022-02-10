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

<style lang="scss">
#app {
  font-family: 'Noto Sans Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.toasted {
  font-family: 'Noto Sans Mono', monospace;
  .action {
    color: white !important;
  }

  a {
    color: white;
  }
}
</style>
