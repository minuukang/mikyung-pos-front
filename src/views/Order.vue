<template>
  <div>
    <mt-cell title="테이크 아웃" label="테이크 아웃 주문을 받아봅시다." :class="$style.takeout" class="takeout">
      <mt-button @click="$router.push({ name: 'takeout' })" :class="$style.button" type="default">현황</mt-button>
      <mt-button :disabled="!unusingTakeoutId" @click="$router.push({ name: 'payment', params: { orderInfoId: unusingTakeoutId } })" :class="$style.button" type="primary">주문</mt-button>
    </mt-cell>
    <section :class="$style.table">
      <div :class="$style.card" v-for="(table) in tableInfos">
        <header :class="$style.cardHeader">
          <h3 :class="$style.cardTitle"><v-icon name="list" /> 테이블 {{ table.orderInfoNo }}</h3>
          <p :class="$style.cardRight" v-if="table.infoBeginDate">종료시간 {{ remainDate(table.infoBeginDate) }}</p>
        </header>
        <div :class="$style.cardContainer">
          <mt-cell v-for="order in table.orders" :title="`${order.orderProducts.length}건 주문`" :label="`총합 : ${order.totalPrice}원`">
            <template v-if="order.orderPaymentYn">
              결제완료
            </template>
            <template v-else>
              <mt-button :class="$style.button" size="small" @click="doPayment(order)">결제요청</mt-button>
              <mt-button :class="$style.button" size="small" type="danger" @click="doDelete(order)">삭제</mt-button>
            </template>
          </mt-cell>
          <!--<mt-cell title="1건 주문" label="총합 : 1500원">결제완료</mt-cell>-->
        </div>
        <footer :class="$style.cardFooter">
          <template v-if="table.useYn">
            <mt-button :class="$style.button" @click="$router.push({ name: 'payment', params: { orderInfoId: table.orderInfoId } })" type="primary">추가주문</mt-button>
            <mt-button :class="$style.button" @click="exitOrder(table)" type="danger">종료</mt-button>
          </template>
          <template v-else>
            <mt-button :class="$style.button" @click="$router.push({ name: 'payment', params: { orderInfoId: table.orderInfoId } })" type="primary">주문하기</mt-button>
          </template>
        </footer>
      </div>
    </section>
  </div>
</template>
<style>
  .takeout .mint-cell-wrapper {
    background: none;
  }
</style>
<style lang="scss" module>
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
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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
  import { Getter } from 'vuex-class';
  import { Order, Table } from '../store/types';
  import { Indicator, MessageBox } from 'mint-ui';
  import api from '@/api/order';
  import moment from 'moment'

  @Component({
    components: {
    },
  })
  export default class OrderComponent extends Vue {
    @Getter('tables')
    protected tables: Table[];
    @Getter('unusingTakeoutId')
    protected unusingTakeoutId: number | null;
    public remainDate (date: number) {
      return date && moment(date).add(90, 'm').format('H:m');
    }
    protected async doPayment(order: Order) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '주문건 결제를 요청하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      Indicator.open('결제중...');
      await api.completePayment(order.orderId);
      Indicator.close();
      await MessageBox({
        title: '안내',
        message: '결제가 완료되었습니다!',
        confirmButtonText: '확인',
      });
      this.$root.$emit('refresh');
    }
    protected async doDelete(order: Order) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '주문건을 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      Indicator.open('삭제중...');
      await api.deleteOrder(order.orderId);
      Indicator.close();
      await MessageBox({
        title: '안내',
        message: '주문이 삭제되었습니다!',
        confirmButtonText: '확인',
      });
      this.$root.$emit('refresh');
    }
    protected async exitOrder(table: Table) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '정말로 종료하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      Indicator.open('종료중...');
      await api.exitOrder(table.orderInfoId);
      Indicator.close();
      await MessageBox({
        title: '안내',
        message: '주문이 종료되었습니다!',
        confirmButtonText: '확인',
      });
      this.$root.$emit('refresh');
    }
    get tableInfos() {
      return this.tables.map((table) => {
        return {
          ...table,
          orders: table.orders.map((order) => {
            return {
              ...order,
              totalPrice: order.orderProducts.reduce((result, data) => {
                return result + (data.productCount * data.product.salesAmount);
              }, 0),
            };
          }),
        };
      });
    }
  }
</script>
