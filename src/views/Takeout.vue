<template>
  <div :class="$style.container">
    <template v-for="takeout in takeoutsAsc">
      <div :class="$style.card" v-for="order in takeout.orders">
        <header :class="$style.cardHeader">
          <h3 :class="$style.cardTitle">대기번호 {{ takeout.orderInfoNo }}</h3>
        </header>
        <div :class="$style.cardContainer">
          <mt-cell v-for="item in order.orderProducts" :title="item.product.productName" :label="`${item.productCount}개 / ${item.product.salesAmount}원`">
            {{ item.orderProductStatus === 'ORDER_COMPLETE' ? '주문완료' : item.orderProductStatus === 'COOK_ING' ? '요리중' : '요리완료' }}
          </mt-cell>
        </div>
        <footer :class="$style.cardFooter">
          <mt-button @click="doPayment(order)" v-if="!order.orderPaymentYn" :class="$style.button" type="primary">결제처리</mt-button>
          <mt-button @click="doSuccess(takeout)" v-else :class="$style.button" type="primary">종료</mt-button>
          <mt-button @click="doCancel(order)" :class="$style.button" type="danger">취소</mt-button>
        </footer>
      </div>
    </template>
    <mt-button :disabled="!unusingTakeoutId" @click="$router.push({ name: 'payment', params: { orderInfoId: unusingTakeoutId } })" type="primary" size="large" :class="$style.addButton">주문 추가</mt-button>
  </div>
</template>
<style lang="scss" module>
  .container {
    padding: 15px 10px;
  }
  .addButton {
    margin-top: 15px;
  }
  .button {
    & ~ & {
      margin-left: 10px;
    }
  }
  .card {
    background-color: #ffffff;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.05);
    & ~ & {
      margin-top: 15px;
    }
    &Header {
      padding-bottom: 8px;
    }
    &Title {
      font-size: 16px;
    }
    &Footer {
      margin-top: 10px;
      display: flex;
      & > * {
        flex: 1;
      }
    }
  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { Order, Table } from '../store/types';
  import { MessageBox, Indicator } from 'mint-ui';
  import { confirmMessage } from '../helper/confirm';

  @Component({
    components: {
    },
  })
  export default class Takeout extends Vue {
    @Getter('unusingTakeoutId')
    protected unusingTakeoutId: number | null;
    @Getter('usingTakeouts')
    protected takeouts: Table[];
    @Action('completePayment') protected completePayment: ActionMethod;
    @Action('exitOrder') protected exitOrder: ActionMethod;
    @Action('deleteOrder') protected deleteOrder: ActionMethod;
    get takeoutsAsc(): Table[] {
      return this.takeouts.slice().sort((info1, info2) => {
        return info1.infoBeginDate - info2.infoBeginDate;
      });
    }
    @confirmMessage('결제')
    protected async doPayment(order: Order) {
      await this.completePayment(order.orderId);
    }
    @confirmMessage('주문종료')
    protected async doSuccess(order: Table) {
      await this.exitOrder(order.orderInfoId);
    }
    @confirmMessage('주문취소')
    protected async doCancel(order: Order) {
      await this.deleteOrder(order.orderId);
    }
  }
</script>
