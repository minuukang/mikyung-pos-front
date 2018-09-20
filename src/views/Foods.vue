<template>
  <div :class="$style.container">
    <section :class="$style.table" v-if="tableInfos.length">
      <div :class="$style.card" v-for="(table) in tableInfos">
        <header :class="$style.cardHeader">
          <h3 :class="$style.cardTitle"><v-icon name="list" /> {{ table.orderInfoType === 'TABLE' ? '테이블' : '테이크아웃' }} {{ table.orderInfoNo }}</h3>
        </header>
        <div :class="$style.cardContainer">
          <template v-for="item in table.orders">
            <mt-cell
              v-for="orderItem in item.orderProducts"
              v-if="!orderItem.product.productAutoCookingCompleteYn"
              :class="$style.item"
              :title="orderItem.product.productName"
              :label="`${orderItem.productCount}개`"
            >
              <mt-button @click="changeStatus(item.orderId, orderItem.product.productId)" size="small" v-if="orderItem.orderProductStatus === 'ORDER_COMPLETE'">
                <v-icon name="cookie" /> 요리 시작하기</mt-button>
              <mt-button @click="changeStatus(item.orderId, orderItem.product.productId)" size="small" type="danger" v-else-if="orderItem.orderProductStatus === 'COOK_ING'">
                <v-icon name="fire" /> 요리 종료하기</mt-button>
              <span :class="$style.statusSuccess" v-else>요리완료</span>
            </mt-cell>
          </template>
          <!--<mt-cell title="1건 주문" label="총합 : 1500원">결제완료</mt-cell>-->
        </div>
        <footer :class="$style.cardFooter">

        </footer>
      </div>
    </section>
    <no-data v-else></no-data>
  </div>
</template>
<style>
  .takeout .mint-cell-wrapper {
    background: none;
  }
</style>
<style lang="scss" module>
  .statusSuccess {
    font-weight: bold;
    color: #ff4949;
  }
  .item {
    min-height: 60px !important;
  }
  .takeout {
    padding: 15px 0;
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
  .table {
    padding: 15px 10px;
  }
  .card {

  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter, State } from 'vuex-class';
  import { OrderItem, Table } from '../store/types';
  import { Indicator, MessageBox } from 'mint-ui';
  import NoData from '../components/NoData.vue';
  import api from '@/api/order';

  @Component({
    components: {
      NoData,
    },
  })
  export default class Order extends Vue {
    @State('orderInfos')
    protected orderInfos: Table[];
    protected async changeStatus(orderId: number, productId: number) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '정말로 상태를 변경하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      Indicator.open('변경중...');
      await api.changeStatus({
        orderId,
        productId,
      });
      Indicator.close();
      await MessageBox({
        title: '안내',
        message: '상태가 변경되었습니다!',
        confirmButtonText: '확인',
      });
      this.$root.$emit('refresh');
    }
    get tableInfos() {
      return this.orderInfos.filter((table) => {
        return table.orders.filter((order) => {
          const cookingProducts = order.orderProducts.filter((item) => item.product.productAutoCookingCompleteYn === false);
          return order.orderPaymentYn === true && cookingProducts.length &&
            cookingProducts.length !== cookingProducts.filter((orderItem) => orderItem.orderProductStatus === 'COOK_END').length;
        }).length;
      }).sort((info1, info2) => {
        const status1 = info1.orders.every((order) => {
          return order.orderProducts.every((item) => item.orderProductStatus === 'COOK_END');
        });
        const status2 = info2.orders.every((order) => {
          return order.orderProducts.every((item) => item.orderProductStatus === 'COOK_END');
        });
        return Number(status1) - Number(status2);
      });
    }
  }
</script>
