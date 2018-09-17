import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Order from './views/Order.vue';
import Payment from './views/Payment.vue';
import Takeout from './views/Takeout.vue';
import Foods from './views/Foods.vue';
import Status from './views/Status.vue';
import NoData from './components/NoData.vue';

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
      path: '/foods',
      name: 'foods',
      component: Foods,
    },
    {
      path: '/payment/:orderInfoId',
      name: 'payment',
      component: Payment,
    },
    {
      path: '/status/:orderId?',
      name: 'status',
      component: Status,
    },
    {
      path: '/takeout',
      name: 'takeout',
      component: Takeout,
    },
    {
      path: '*',
      name: '404',
      component: NoData,
    },
  ],
});
