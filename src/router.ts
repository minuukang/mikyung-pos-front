import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Order from './views/Order.vue'
import Payment from './views/Payment.vue'
import Takeout from './views/Takeout.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
    },
    {
      path: '/payment/:orderInfoId',
      name: 'payment',
      component: Payment,
    },
    {
      path: '/takeout',
      name: 'takeout',
      component: Takeout
    },
  ],
});
