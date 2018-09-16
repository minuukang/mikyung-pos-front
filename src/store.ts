import Vue from 'vue';
import Vuex from 'vuex';
import { Product, ProductGroup, Table } from '@/store/types';
import loadProducts from '@/api/loadProducts';
import loadTables from '@/api/loadTables';
import orderApi from '@/api/order';

Vue.use(Vuex);

interface RootState {
  productGroups: ProductGroup[];
  orderInfos: Table[];
  userName: string;
}

export default new Vuex.Store<RootState>({
  state: {
    productGroups: [],
    orderInfos: [],
    userName: '',
  },
  getters: {
    products(state): Product[] {
      return state.productGroups.reduce<Product[]>((result, { products }) => {
        return result.concat(products);
      }, []);
    },
    tables(state): Table[] {
      return state.orderInfos.filter((info) => {
        return info.orderInfoType === 'TABLE';
      });
    },
    takeouts(state): Table[] {
      return state.orderInfos.filter((info) => {
        return info.orderInfoType === 'TAKE_OUT';
      });
    },
    usingTakeouts(state, getters): Table[] {
      return (getters.takeouts as Table[]).filter((info) => {
        return info.useYn === true;
      });
    },
    unUsingTakeouts(state, getters): Table[] {
      return (getters.takeouts as Table[]).filter((info) => {
        return info.useYn === false;
      });
    },
    unusingTakeoutId(state, getters) {
      return getters.unUsingTakeouts.length ? getters.unUsingTakeouts[0].orderInfoId : null;
    },
  },
  mutations: {
    replaceProductGroups(state, payload: ProductGroup[]) {
      state.productGroups = payload;
    },
    replaceTables(state, payload: Table[]) {
      state.orderInfos = payload;
    },
    addTable(state, payload: Table) {
      state.orderInfos.push(payload);
    },
    setUserName(state, payload: string) {
      state.userName = payload;
    },
  },
  actions: {
    loadProductGroups(context) {
      return loadProducts().then((productGroups) => {
        context.commit('replaceProductGroups', productGroups);
      });
    },
    loadTables(context) {
      return loadTables().then((tables) => {
        // tables.forEach(table => context.commit('addTable', table))
        context.commit('replaceTables', tables);
      });
    },
    paymentOrder(context, payload) {
      return orderApi.paymentOrder({
        ...payload,
        orderOwnerName: context.state.userName,
      });
    },
    loadUserName(context) {
      const userName = localStorage.getItem('posUserName') || '';
      return context.dispatch('setUserName', userName);
    },
    setUserName(context, payload: string) {
      localStorage.setItem('posUserName', payload);
      context.commit('setUserName', payload);
    },
  },
});
