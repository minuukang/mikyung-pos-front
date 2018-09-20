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
    <button :class="$style.logout" @click="doLogout">로그아웃</button>
  </div>
</template>
<style lang="scss" module>
  .copyright {
    margin-top: 10px;
    color: #cccccc;
  }
  .logout {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 3px;
    color: #26a2ff;
    border-bottom: 1px solid currentColor;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
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
import { Action } from 'vuex-class';
import { ActionMethod } from 'vuex';
import { confirmMessage } from '../helper/confirm';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  @Action('logout') protected logout: ActionMethod;
  @confirmMessage('로그아웃')
  protected async doLogout() {
    await this.logout();
  }
}
</script>
