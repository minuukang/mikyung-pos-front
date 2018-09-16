<template>
  <div :class="$style.container">
    <template v-for="takeout in takeoutsAsc">
      <order-card v-for="order in takeout.orders" :order="order" :table="takeout" :show-price="false"></order-card>
    </template>
    <mt-button :disabled="!unusingTakeoutId" @click="$router.push({ name: 'payment', params: { orderInfoId: unusingTakeoutId } })" type="primary" size="large" :class="$style.addButton"><v-icon name="plus-circle" /> 주문 추가</mt-button>
  </div>
</template>
<style lang="scss" module>
  .container {
    padding: 15px 10px;
  }
  .addButton {
    margin-top: 15px;
  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter, Action } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { Order, Table } from '../store/types';
  import { MessageBox, Indicator } from 'mint-ui';
  import { confirmMessage } from '../helper/confirm';
  import OrderCard from '../components/OrderCard.vue';

  @Component({
    components: {
      OrderCard,
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
    @confirmMessage('완료')
    protected async doSuccess(order: Table) {
      await this.exitOrder(order.orderInfoId);
    }
    @confirmMessage('주문취소')
    protected async doCancel(order: Order) {
      await this.deleteOrder(order.orderId);
    }
  }
</script>
