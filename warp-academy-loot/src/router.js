import Vue from 'vue';
import Router from 'vue-router';
import About from './views/About.vue';
import Assets from './views/Assets.vue';
import MyAssets from './views/MyAssets.vue';
import AssetsOfUser from './views/AssetsOfUser.vue';
import Leaderboard from './views/Leaderboard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'about',
      component: About,
    },
    {
      path: '/assets',
      name: 'assets',
      component: Assets,
    },
    {
      path: '/my-assets',
      name: 'my-assets',
      component: MyAssets,
    },
    {
      path: '/assets/:owner',
      name: 'assetsOfUser',
      component: AssetsOfUser,
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard,
    },
  ],
});
