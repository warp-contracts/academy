import Vue from 'vue'
import App from './App.vue'
import VueTimers from 'vue-timers'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueLoaders from 'vue-loaders'
import { ObserveVisibility } from 'vue-observe-visibility'
import '@babel/polyfill'
import 'vue-loaders/dist/vue-loaders.css'

Vue.config.productionTip = false

Vue.directive('observe-visibility', ObserveVisibility)

Vue.use(VueTimers)
Vue.use(VueLoaders)

Vue.filter('short-address', function(val) {
  if (val) {
    return val.slice(0, 5) + '...' + val.slice(-5)
  } else {
    return ''
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
