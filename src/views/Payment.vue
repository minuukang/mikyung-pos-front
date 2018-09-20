<template>
  <div :class="{[$style.active]: totalPrice}">
    <header :class="$style.header" v-if="orderInfo">
      <h2 :class="$style.title">{{ orderInfo.orderInfoType === 'TABLE' ? `${orderInfo.orderInfoNo}번 테이블` : '테이크아웃' }} 주문</h2>
    </header>
    <mt-navbar v-model="menuGroup">
      <mt-tab-item id="">전체</mt-tab-item>
      <mt-tab-item v-for="group in productGroups" :id="group.productGroupName">{{ group.productGroupName }}</mt-tab-item>
    </mt-navbar>
    <dl :class="$style.group" v-for="group in productGroups" v-if="!menuGroup || menuGroup === group.productGroupName">
      <dt :class="$style.groupTitle" v-if="!menuGroup">{{ group.productGroupName }}</dt>
      <dd :class="$style.groupContent">
        <food-item v-for="food in group.products" :model="food" v-model="productEa"></food-item>
      </dd>
    </dl>
    <!--<section>-->
    <!--<button :disabled="!orderProducts.length" type="submit">주문하기</button>-->
    <!--<button type="button">취소</button>-->
    <!--</section>-->
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <aside :class="$style.result" v-if="totalPrice">
        <input type="tel" v-model="receiveAmount" name="receiveAmount" id="receiveAmount" :class="$style.resultInput" placeholder="받은 금액">
        <mt-button @click="doAction" :class="$style.resultItem" size="large" type="primary">주문완료 ({{ totalPrice | numberFormat }}원)</mt-button>
      </aside>
    </transition>
  </div>
</template>
<style lang="scss" module>
  .active {
    padding-bottom: 130px;
  }
  .header {
    background-color: lighten(#55b6ff, 10%);
    color: #ffffff;
    text-align: center;
    padding: 15px 0;
    font-size: 16px;
  }
  .result {
    position: fixed;
    z-index: 15;
    bottom: 0;
    border-top: 1px solid #eeeeee;
    width: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    animation-duration: 400ms;
    padding: 15px;
    &Input {
      display: block;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #dfdfdf;
    }
    &Item {
      flex: 1;
    }
  }
  .group {
    margin-top: 10px;
    &Title {
      padding: 10px;
      background-color: #f5f5f5;
      font-size: 14px;
      font-weight: bold;
    }
  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { ProductGroup, Product, Table } from '../store/types';
  import FoodItem from '../components/FoodItem.vue';
  import { Indicator, MessageBox } from 'mint-ui';
  import { confirmMessage } from '../helper/confirm';
  import { numberFormat } from '@/helper/number-format';

  export interface ProductEa {
    productId: number;
    ea: number;
  }

  async function showDescriptionMessage(this: Payment) {
    const paymentProductMessage = this.productEa.filter(({ea}) => ea > 0).map(({productId, ea}) => {
      return {
        product: this.products.find((product: Product) => product.productId === productId) as Product,
        ea,
      };
    }).map(({product, ea}) => {
      return `${product.productName} : ${ea}개`;
    }).join('<br>');
    await MessageBox({
      $type: 'confirm',
      title: '주문 내역 확인',
      message: `${paymentProductMessage}<br>(받은 금액 : ${numberFormat(this.receiveAmount || this.totalPrice)}원)<br>주문 내용이 맞으십니까?`,
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });
  }

  @Component({
    components: {
      FoodItem,
    },
  })
  export default class Payment extends Vue {
    @State('productGroups')
    protected productGroups: ProductGroup[];
    @State('orderInfos')
    protected orderInfos: Table[];
    @Getter('products')
    protected products: Product[];
    @Action('paymentOrder')
    protected paymentOrder: ActionMethod;
    protected productEa: ProductEa[] = [];
    protected receiveAmount: number | null = null;
    protected menuGroup: string = '';
    get orderInfo() {
      return this.orderInfos.find((info) => info.orderInfoId === this.orderInfoId);
    }
    get orderInfoId() {
      return Number(this.$route.params.orderInfoId);
    }
    @confirmMessage('주문', { name: 'order' }, showDescriptionMessage)
    protected async doAction() {
      if (!this.orderProducts.length) {
        throw new Error('1개 이상의 상품을 담아주세요!');
      }
      await this.paymentOrder({
        orderInfoId: Number(this.orderInfoId),
        receiveAmount: Number(this.receiveAmount) || this.totalPrice,
        products: this.orderProducts.map(({ ea, product }) => {
          return {
            productId: product.productId,
            productCount: ea,
          };
        }),
      });
    }
    get orderProducts() {
      return this.productEa.filter(({ ea }) => ea > 0).map(({ productId, ea }) => {
        const product = this.products.find((food) => food.productId === productId) as Product;
        return {
          product,
          ea,
        };
      }).sort((product1, product2) => {
        return product1.product.productId - product2.product.productId;
      });
    }
    get totalPrice() {
      return this.orderProducts.reduce((result, { product, ea }) => {
        return result + (ea * product.salesAmount);
      }, 0);
    }
  }
</script>
