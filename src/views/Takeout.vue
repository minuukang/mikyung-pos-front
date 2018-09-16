<template>
  <div :class="$style.container">
    <template v-for="takeout in takeouts">
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
  import { Getter } from 'vuex-class';
  import { Order, Table } from '../store/types';
  import { MessageBox, Indicator } from 'mint-ui';
  import api from '@/api/order';

  @Component({
    components: {
    },
  })
  export default class Takeout extends Vue {
    @Getter('unusingTakeoutId')
    protected unusingTakeoutId: number | null;
    @Getter('usingTakeouts')
    protected takeouts: Table[];
    protected async doPayment(order: Order) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '결제를 요청하시겠습니까?',
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
    protected async doSuccess(order: Table) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '주문을 종료하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      Indicator.open('결제중...');
      await api.exitOrder(order.orderInfoId);
      Indicator.close();
      await MessageBox({
        title: '안내',
        message: '주문이 종료되었습니다!',
        confirmButtonText: '확인',
      });
      this.$root.$emit('refresh');
    }
    protected async doCancel(order: Order) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: '주문을 취소하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      Indicator.open('취소중...');
      await api.deleteOrder(order.orderId);
      Indicator.close();
      await MessageBox({
        title: '안내',
        message: '주문이 취소되었습니다!',
        confirmButtonText: '확인',
      });
      this.$root.$emit('refresh');
    }
  }
</script>
