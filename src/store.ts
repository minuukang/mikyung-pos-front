import Vue from 'vue';
import Vuex from 'vuex';
import { Product, ProductGroup, Table } from '@/store/types';
import loadProducts from '@/api/loadProducts';
import loadTables from '@/api/loadTables';
import orderApi, { OrderChangeStatusPayload } from '@/api/order';
import users from '@/config/users.json';

Vue.use(Vuex);

interface RootState {
  productGroups: ProductGroup[];
  orderInfos: Table[];
  userName: string;
  bankImage: string | null;
}

function roleMatch(role: string, ...matchRole: string[]): boolean {
  return role === '*' || (matchRole.indexOf(role) !== -1);
}

export default new Vuex.Store<RootState>({
  state: {
    productGroups: [],
    orderInfos: [],
    userName: '',
    bankImage: null,
  },
  getters: {
    userRole(state) {
      return state.userName && (users.find((user) => user.name === state.userName) as any).role;
    },
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
    setUserName(state, payload: string) {
      state.userName = payload;
    },
    setBankImage(state, payload: string) {
      state.bankImage = payload;
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
        context.commit('replaceTables', tables);
      });
    },
    async paymentOrder(context, payload) {
      if (!roleMatch(context.getters.userRole, '캐셔', '서빙')) {
        throw new Error('권한이 없습니다!');
      }
      return orderApi.paymentOrder({
        ...payload,
        orderOwnerName: context.state.userName,
      });
    },
    exitOrder(context, orderId: number) {
      if (!roleMatch(context.getters.userRole, '캐셔', '서빙')) {
        throw new Error('권한이 없습니다!');
      }
      return orderApi.exitOrder(orderId);
    },
    changeStatus(context, { orderId, productId }: OrderChangeStatusPayload) {
      if (!roleMatch(context.getters.userRole, '요리')) {
        throw new Error('권한이 없습니다!');
      }
      return orderApi.changeStatus({ orderId, productId });
    },
    completePayment(context, orderId: number) {
      if (!roleMatch(context.getters.userRole, '캐셔')) {
        throw new Error('권한이 없습니다!');
      }
      return orderApi.completePayment(orderId);
    },
    deleteOrder(context, orderId: number) {
      if (!roleMatch(context.getters.userRole, '캐셔', '서빙')) {
        throw new Error('권한이 없습니다!');
      }
      return orderApi.deleteOrder(orderId);
    },
    loadUserName(context) {
      const userName = localStorage.getItem('posUserName') || '';
      return userName && context.dispatch('setUserName', userName);
    },
    async setUserName(context, payload: string) {
      if (users.some((user) => user.name === payload)) {
        localStorage.setItem('posUserName', payload);
        context.commit('setUserName', payload);
      } else {
        throw new Error('미경이 아니시네요!');
      }
    },
    logout(context) {
      localStorage.setItem('posUserName', '');
      context.commit('setUserName', '');
    },
    loadBankImage(context) {
      const image = new Image();
      image.addEventListener('load', () => {
        context.commit('setBankImage', image.src);
      });
      image.src = require('./assets/card.png');
    },
  },
});
