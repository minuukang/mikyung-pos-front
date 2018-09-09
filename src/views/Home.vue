<template>
  <div class="home">
    <ul>
      <li><mt-button type="primary" size="large" @click="$router.push({ name: 'order' })">주문 받기</mt-button></li>
      <li><mt-button type="default" size="large" @click="$router.push({ name: 'order' })">테이블 현황</mt-button></li>
      <li><mt-button type="default" size="large" @click="$router.push({ name: 'order' })">요리 현황</mt-button></li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
  ul {
    padding: 2rem;
  }
  li ~ li {
    margin-top: 1.5rem;
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
