<template>
  <form @submit.prevent="loginAction" :class="$style.container">
    <div :class="[$style.logo, animatedLogo]"></div>
    <div :class="$style.fieldset">
      <input type="text" name="name" placeholder="이름을 입력해주세요" :class="$style.input" v-model="userName">
      <mt-button :disabled="!userName" :class="$style.button" type="primary" size="large">로그인</mt-button>
    </div>
  </form>
</template>
<style lang="scss" module>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .logo {
    width: 120px;
    height: 120px;
    background-image: url(/apple-icon-precomposed.png);
    background-size: 100% 100%;
  }
  .button {
    margin-top: 10px;
  }
  .fieldset {
    margin-top: 20px;
    width: 100%;
  }
  .input {
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    text-align: center;
    font-size: 18px;
    &::placeholder {
      color: #aaa;
    }
  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { MessageBox } from 'mint-ui';

  @Component({
    name: 'login',
  })
  export default class Login extends Vue {
    protected userName: string = '';
    @Action('setUserName')
    protected setUserName: ActionMethod;
    protected animatedLogo: string = '';
    protected animatedTimer: any = 0;
    protected mounted() {
      this.animatedTimer = setTimeout(function animatedFx(this: Login) {
        this.animatedLogo = 'animated rubberBand';
        setTimeout(() => {
          this.animatedLogo = '';
          this.animatedTimer = setTimeout(animatedFx.bind(this), 1500);
        }, 1500);
      }.bind(this));
    }
    protected async loginAction() {
      try {
        await this.setUserName(this.userName);
        this.$router.replace({ name: 'home' });
      } catch (e) {
        await MessageBox({
          title: '',
          message: e.message,
          closeOnClickModal: false,
          confirmButtonText: '확인',
        });
      }
    }
  }
</script>
