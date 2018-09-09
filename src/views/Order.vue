<template>
  <div>
    <mt-cell title="테이크 아웃" label="테이크 아웃 주문을 받아봅시다." :class="$style.takeout" class="takeout">
      <mt-button @click="$router.push({ name: 'takeout' })" :class="$style.button" type="default">현황</mt-button>
      <mt-button :disabled="!unusingTakeoutId" @click="$router.push({ name: 'payment', params: { orderInfoId: unusingTakeoutId } })" :class="$style.button" type="primary">주문</mt-button>
    </mt-cell>
    <section :class="$style.table">
      <div :class="$style.card" v-for="(table, index) in tables">
        <header :class="$style.cardHeader">
          <h3 :class="$style.cardTitle">테이블 {{ index + 1 }}</h3>
        </header>
        <div :class="$style.cardContainer">
          <!--<mt-cell title="2건 주문" label="총합 : 1000원">결제완료</mt-cell>-->
          <!--<mt-cell title="1건 주문" label="총합 : 1500원">결제완료</mt-cell>-->
        </div>
        <footer :class="$style.cardFooter">
          <template v-if="table.useYn">
            <mt-button :class="$style.button" @click="$router.push({ name: 'payment', params: { orderInfoId: table.orderInfoId } })" type="primary">추가주문</mt-button>
            <mt-button :class="$style.button" type="danger">종료</mt-button>
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
  import { Getter } from 'vuex-class'
  import { Table } from '../store/types'
  import { Indicator, MessageBox } from 'mint-ui'

  export interface ProductEa {
    id: number
    ea: number
  }

  @Component({
    components: {
    },
  })
  export default class Order extends Vue {
    @Getter('tables') tables: Table[]
    @Getter('unusingTakeoutId') unusingTakeoutId: number | null
  }
</script>
