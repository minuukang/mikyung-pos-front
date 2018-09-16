<template>
  <div>
    <section :class="$style.table">
      <div :class="$style.card" v-for="(table, index) in tableInfos">
        <header :class="$style.cardHeader">
          <h3 :class="$style.cardTitle">테이블 {{ index + 1 }}</h3>
        </header>
        <div :class="$style.cardContainer">
          <mt-cell v-for="order in table.orders" :title="`${order.orderProducts.length}건 주문`" :label="`총합 : ${order.totalPrice}원`">결제완료</mt-cell>
          <!--<mt-cell title="1건 주문" label="총합 : 1500원">결제완료</mt-cell>-->
        </div>
        <footer :class="$style.cardFooter">

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
  import { Table } from '../store/types';
  import { Indicator, MessageBox } from 'mint-ui';
  import api from '@/api/order';

  @Component({
    components: {
    },
  })
  export default class Order extends Vue {
    @Getter('tables')
    protected tables: Table[];
    @Getter('unusingTakeoutId')
    protected unusingTakeoutId: number | null;
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
      return this.tables.filter((table) => {
        return table.orders.length;
      });
    }
  }
</script>
