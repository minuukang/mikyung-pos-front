import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';
import { numberFormat } from '@/helper/number-format';

Vue.use(Mint);
Vue.component('v-icon', Icon);
Vue.filter('numberFormat', numberFormat);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
