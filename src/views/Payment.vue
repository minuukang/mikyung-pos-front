<template>
  <div>
    <header :class="$style.header" v-if="orderInfo">
      <h2 :class="$style.title">{{ orderInfo.orderInfoType === 'TABLE' ? `테이블 No.${orderInfo.orderInfoNo}` : '테이크아웃' }} 주문</h2>
    </header>
    <dl :class="$style.group" v-for="group in productGroups">
      <dt :class="$style.groupTitle">{{ group.productGroupName }}</dt>
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
        <mt-button @click="doAction" :class="$style.resultItem" size="large" type="primary">주문완료 ({{ totalPrice }}원)</mt-button>
      </aside>
    </transition>
  </div>
</template>
<style lang="scss" module>
  .header {
    background-color: #ddd;
    text-align: center;
    padding: 15px 0;
    font-size: 16px;
  }
  .result {
    position: fixed;
    z-index: 15;
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    background-color: #ffffff;
    animation-duration: 400ms;
    padding: 15px;
    &Item {
      flex: 1;
    }
  }
  .group {
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
  import { State, Action, Getter } from 'vuex-class'
  import { ActionMethod } from 'vuex'
  import { ProductGroup, Product, Table } from '../store/types'
  import FoodItem from '../components/FoodItem'
  import { Indicator, MessageBox } from 'mint-ui'

  export interface ProductEa {
    productId: number
    ea: number
  }

  @Component({
    components: {
      FoodItem,
    },
  })
  export default class Order extends Vue {
    @State('productGroups') productGroups: ProductGroup[]
    @State('orderInfos') orderInfos: Table[]
    @Getter('products') products: Product[]
    @Action('paymentOrder') paymentOrder: ActionMethod
    productEa: ProductEa[] = []
    get orderInfo () {
      return this.orderInfos.find(info => info.orderInfoId === this.orderInfoId)
    }
    get orderInfoId () {
      return Number(this.$route.params.orderInfoId)
    }
    async doAction () {
      if (this.orderProducts.length) {
        try {
          await MessageBox({
            $type: 'confirm',
            title: '안내',
            message: '정말로 주문하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
          })
          Indicator.open('주문중...');
          await this.paymentOrder({
            orderInfoId: Number(this.orderInfoId),
            products: this.orderProducts.map(({ ea, product }) => {
              return {
                productId: product.productId,
                productCount: ea
              }
            })
          });
          Indicator.close();
          await MessageBox({
            title: '안내',
            message: '주문이 완료되었습니다!',
            confirmButtonText: '확인'
          })
          this.$router.push({ name: 'home' })
        } catch (e) {
        }
      }
    }
    get orderProducts () {
      return this.productEa.filter(({ ea }) => ea > 0).map(({ productId, ea }) => {
        const product = this.products.find(food => food.productId === productId) as Product
        return {
          product,
          ea
        }
      }).sort((product1, product2) => {
        return product1.product.productId - product2.product.productId
      })
    }
    get totalPrice () {
      return this.orderProducts.reduce((result, { product, ea }) => {
        return result + (ea * product.salesAmount)
      }, 0)
    }
  }
</script>
