import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';
import numeral from 'numeral';

Vue.use(Mint);
Vue.component('v-icon', Icon);
Vue.filter('numberFormat', (value: number) => {
  return numeral(value).format('0,0');
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
