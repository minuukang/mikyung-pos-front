<template>
  <div :class="$style.container">
    <ul :class="$style.list">
      <li :class="$style.item"><mt-button type="primary" size="large" @click="$router.push({ name: 'order' })">
        <v-icon name="credit-card" /> 주문 및 테이블</mt-button></li>
      <li :class="$style.item"><mt-button type="default" size="large" @click="$router.push({ name: 'status' })">
        <v-icon name="concierge-bell" /> 서빙 현황</mt-button></li>
      <li :class="$style.item"><mt-button type="default" size="large" @click="$router.push({ name: 'foods' })">
        <v-icon name="cookie" /> 요리 현황</mt-button></li>
    </ul>
    <p :class="$style.copyright">UI development by @minuukang</p>
  </div>
</template>
<style lang="scss" module>
  .copyright {
    margin-top: 10px;
    color: #cccccc;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  .list {
    width: 100%;
  }
  .item {
    & ~ & {
      margin-top: 15px;
    }
  }
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Home extends Vue {}
</script>
