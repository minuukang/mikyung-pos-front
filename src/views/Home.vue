<template>
  <div :class="$style.container">
    <ul :class="$style.list">
      <li :class="$style.item"><mt-button type="primary" size="large" @click="$router.push({ name: 'order' })">
        <v-icon name="credit-card" /> 주문 및 테이블</mt-button></li>
      <li :class="$style.item"><mt-button type="default" size="large" @click="$router.push({ name: 'status' })">
        <v-icon name="concierge-bell" /> 서빙 현황</mt-button></li>
      <li :class="$style.item"><mt-button type="default" size="large" @click="$router.push({ name: 'foods' })">
        <v-icon name="cookie" /> 요리 현황</mt-button></li>
      <li :class="$style.item"><mt-button type="default" :class="$style.bankButton" size="large" @click="showBank">
        <v-icon name="money-check" /> 계좌보기</mt-button></li>
    </ul>
    <p :class="$style.copyright">UI development by @minuukang</p>
    <button :class="$style.logout" @click="doLogout"><strong>{{ userName }}</strong> 로그아웃</button>
    <transition enter-active-class="animated slideInDown" :leave-active-class="`animated slideOut${closeTypeCamel}`">
      <bank-view @close="hideBank" v-if="bankShowFlag" :class="$style.bank"></bank-view>
    </transition>
  </div>
</template>
<style lang="scss" module>
  .copyright {
    margin-top: 10px;
    color: #cccccc;
  }
  .bank {
    position: fixed;
    z-index: 30;
    animation-duration: 500ms;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    &Button {
      background-color: #9dc3da !important;
      color: #fff !important;
    }
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
import { Action, State } from 'vuex-class';
import { ActionMethod } from 'vuex';
import { confirmMessage } from '../helper/confirm';
import BankView from '../components/Bank.vue';

@Component({
  components: {
    BankView,
  },
})
export default class Home extends Vue {
  @Action('logout') protected logout: ActionMethod;
  @State('userName') protected userName: string;
  protected bankShowFlag: boolean = false;
  protected closeType: string = 'down';
  @confirmMessage('로그아웃')
  protected async doLogout() {
    await this.logout();
  }
  protected showBank() {
    this.bankShowFlag = true;
  }
  get closeTypeCamel() {
    return this.closeType[0].toUpperCase() + this.closeType.substr(1);
  }
  protected hideBank(closeType: string = 'down') {
    this.closeType = closeType;
    this.$nextTick().then(() => {
      this.bankShowFlag = false;
    });
  }
}
</script>
