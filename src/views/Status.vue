<template>
  <div :class="$style.container">
    <template v-if="availableOrders.length">
      <order-card v-for="order in availableOrders" :key="order.orderId" :order="order" :table="order.table"></order-card>
    </template>
    <no-data v-else></no-data>
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
  import NoData from '../components/NoData.vue';

  @Component({
    components: {
      OrderCard,
      NoData,
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
        return (order2.orderDate - order1.orderDate);
      }).filter((order: Order) => {
        return this.statusDetailOrderId ? order.orderId === this.statusDetailOrderId : true;
      });
    }
  }
</script>
