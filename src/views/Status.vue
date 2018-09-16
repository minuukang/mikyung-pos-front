<template>
  <div :class="$style.container">
    <order-card v-for="order in availableOrders" :order="order" :table="order.table"></order-card>
  </div>
</template>
<style lang="scss" module>
  .container {
    padding: 20px 10px;
  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import { Order, Table } from '../store/types';
  import OrderCard from '../components/OrderCard.vue';

  function getOrderIsSuccess(order: Order) {
    const cookingProducts = order.orderProducts.filter((orderItem) => !orderItem.product.productAutoCookingCompleteYn);
    const cookingSuccessProducts = cookingProducts.filter((orderItem) => orderItem.orderProductStatus === 'COOK_END');
    return cookingProducts.length === cookingSuccessProducts.length;
  }

  @Component({
    components: {
      OrderCard,
    },
  })
  export default class Status extends Vue {
    @State('orderInfos') protected orderInfos: Table[];
    get statusDetailOrderId() {
      return Number(this.$route.params.orderId);
    }
    get availableOrders() {
      return this.orderInfos.filter((info) => {
        return info.orders.length > 0;
      }).reduce<Order[]>((result, table) => {
        return result.concat(table.orders.map((order) => {
          return {
            ...order,
            table,
          };
        }));
      }, []).sort((order1: Order, order2: Order) => {
        const orderEnd1 = +getOrderIsSuccess(order1);
        const orderEnd2 = +getOrderIsSuccess(order2);
        return (orderEnd1 - orderEnd2) || (order2.orderDate - order1.orderDate);
      }).filter((order: Order) => {
        return this.statusDetailOrderId ? order.orderId === this.statusDetailOrderId : true;
      });
    }
  }
</script>
