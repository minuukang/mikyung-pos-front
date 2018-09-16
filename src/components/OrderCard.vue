<template>
  <div :class="$style.card">
    <header :class="$style.cardHeader">
      <div :class="$style.cardHeaderLeft">
        <h3 :class="$style.cardTitle">
          <v-icon name="list" /> {{ table.orderInfoType === 'TABLE' ? '테이블' : '테이크아웃' }} {{ table.orderInfoNo }} 주문
        </h3>
        <!--<p :class="$style.cardInfo">(받은 돈 : {{ order.receiveAmount | numberFormat }}원 / 거스름 돈: {{ order.receiveAmount - totalProductPrice | numberFormat }}원)</p>-->
      </div>
    </header>
    <div :class="$style.cardContainer">
      <mt-cell v-for="item in order.orderProducts" :title="item.product.productName" :label="`${item.productCount}개 / ${item.product.salesAmount}원`">
        <template v-if="!order.orderPaymentYn">
          결제대기중
        </template>
        <template v-else>
          <template v-if="!item.product.productAutoCookingCompleteYn">
            <span v-if="item.orderProductStatus === 'ORDER_COMPLETE'"><v-icon name="check-circle" /> 주문완료</span>
            <span v-else-if="item.orderProductStatus === 'COOK_ING'"><v-icon name="fire" /> 요리중</span>
            <span :class="$style.success" v-else-if="item.orderProductStatus === 'COOK_END'"><v-icon name="exclamation-circle" /> 요리완료</span>
          </template>
          <span v-else>서빙완료</span>
        </template>
      </mt-cell>
    </div>
    <div :class="$style.price" v-if="showPrice">
      <dl :class="$style.priceItem">
        <dt :class="$style.priceItemTitle">상품 총 금액</dt>
        <dd :class="$style.priceItemValue">{{ totalProductPrice | numberFormat }}원</dd>
      </dl>
      <dl :class="$style.priceItem">
        <dt :class="$style.priceItemTitle">받은 돈</dt>
        <dd :class="$style.priceItemValue">{{ order.receiveAmount | numberFormat }}원</dd>
      </dl>
      <dl :class="$style.priceItem">
        <dt :class="$style.priceItemTitle"><strong>거스름 돈</strong></dt>
        <dd :class="$style.priceItemValue">{{ order.receiveAmount - totalProductPrice | numberFormat }}원</dd>
      </dl>
    </div>
    <footer :class="$style.cardFooter">
      <template v-if="!order.orderPaymentYn">
        <mt-button @click="doPayment" :class="$style.button" type="primary"><v-icon name="hand-holding-usd" /> 결제처리</mt-button>
      </template>
      <mt-button v-else-if="table.orderInfoType === 'TAKE_OUT'" :disabled="!canSuccess" @click="doSuccess" :class="$style.button" type="primary"><v-icon name="thumbs-up" /> 완료</mt-button>
      <mt-button @click="doCancel" :class="$style.button" type="danger"><v-icon name="trash" /> 취소</mt-button>
      <!--<mt-button @click="doSuccess(takeout)" v-else :class="$style.button" type="primary">종료</mt-button>-->
    </footer>
  </div>
</template>
<style lang="scss" module>
  .success {
    color: #ff4949;
    font-weight: bold;
  }
  .price {
    background-color: #f2f2f2;
    color: #666666;
    padding: 0 10px;
    &Item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      & ~ & {
        border-top: 1px solid #ddd;
      }
    }
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
    &Info {
      margin-top: 4px;
      color: #888888;
    }
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
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Order, Table } from '../store/types';
  import { State, Action } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { confirmMessage } from '../helper/confirm';

  @Component({ name: 'order-card' })
  export default class OrderCard extends Vue {
    @Prop({ required: true }) protected order: Order;
    @Prop() protected table: Table;
    @Prop({ default: true }) protected showPrice: boolean;
    @Action('completePayment') protected completePayment: ActionMethod;
    @Action('exitOrder') protected exitOrder: ActionMethod;
    @Action('deleteOrder') protected deleteOrder: ActionMethod;
    @confirmMessage('결제')
    protected async doPayment() {
      await this.completePayment(this.order.orderId);
    }
    @confirmMessage('주문 종료')
    protected async doSuccess() {
      await this.exitOrder(this.table.orderInfoId);
    }
    @confirmMessage('주문 취소')
    protected async doCancel() {
      await this.deleteOrder(this.order.orderId);
    }
    get canSuccess() {
      const cookingProducts = this.order.orderProducts.filter((orderItem) => !orderItem.product.productAutoCookingCompleteYn);
      return cookingProducts.length === cookingProducts.filter((orderItem) => orderItem.orderProductStatus === 'COOK_END').length;
    }
    get totalProductPrice() {
      return this.order.orderProducts.reduce((result, orderItem) => {
        return result + (orderItem.productCount * orderItem.product.salesAmount);
      }, 0);
    }
  }
</script>
