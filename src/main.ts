import Vue from 'vue';
import App from './views/App/App.vue';
import router from './router';
import store from './store';
import Toasted from 'vue-toasted';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(Toasted);
Vue.config.productionTip = false;

function setupFilters() {
  Vue.filter('tx', function (value: string) {
    if (!value) return '';
    return value.substr(0, 6) + '...' + value.substr(value.length - 6);
  });
}

setupFilters();

Vue.toasted.register(
  'close',
  function (message) {
    return message;
  },
  {
    type: 'success',
    closeOnSwipe: false,
    className: ['toasting'],
    action: {
      text: 'Close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      },
    },
  }
);

Vue.toasted.register(
  'success',
  function (message) {
    return message;
  },
  {
    type: 'success',
    className: ['toasting'],
    duration: 3000,
  }
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
