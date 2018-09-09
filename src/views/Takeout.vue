<template>
  <div :class="$style.container">
    <div :class="$style.card" v-for="takeout in takeouts">
      <header :class="$style.cardHeader">
        <h3 :class="$style.cardTitle">대기번호 {{ takeout.orderInfoNo }}</h3>
      </header>
      <div :class="$style.cardContainer">
        <mt-cell title="컵라면" label="1개 / 1000원">주문접수</mt-cell>
      </div>
      <footer :class="$style.cardFooter">
        <mt-button :class="$style.button" type="primary">완료</mt-button>
        <mt-button :class="$style.button" @click="$router.push({ name: 'payment', params: { orderInfoId: takeout.orderInfoId } })" type="default">수정</mt-button>
        <mt-button :class="$style.button" type="danger">취소</mt-button>
      </footer>
    </div>
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
  import { Table } from '../store/types'

  @Component({
    components: {
    },
  })
  export default class Order extends Vue {
    @Getter('unusingTakeoutId') unusingTakeoutId: number | null
    @Getter('usingTakeouts') takeouts: Table[]
  }
</script>
