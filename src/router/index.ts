import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Contract from '../views/Contract/Contract.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Contract',
    component: Contract,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
