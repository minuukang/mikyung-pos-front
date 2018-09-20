<template>
  <div id="app" :class="$style.container">
    <header class="mint-header" v-if="userName">
      <div class="mint-header-button is-left">
        <mt-button slot="left" @click="$router.back()" icon="back"></mt-button>
      </div>
      <h1 class="mint-header-title" :class="$style.title"><router-link :to="{ name: 'home' }">미.경.포.스</router-link></h1>
      <div class="mint-header-button is-right">
        <v-icon scale="1.3" name="sync" @click.native="refresh"></v-icon>
      </div>
    </header>
    <div :class="$style.main">
      <transition enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <router-view :class="$style.content" />
      </transition>
    </div>
  </div>
</template>
<style lang="scss" src="./style.scss"></style>
<style lang="scss" module>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .title {
    font-weight: bold !important;
    font-size: 18px !important;
  }
  .main {
    flex: 1;
    position: relative;
  }
  .content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>
<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, State } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { Indicator, MessageBox } from 'mint-ui';

  const REFRESH_TIME = 6500;

  @Component({
    components: {
    },
  })
  export default class App extends Vue {
    @Action('loadProductGroups')
    protected loadProductGroups: ActionMethod;
    @Action('loadTables')
    protected loadTables: ActionMethod;
    @Action('loadUserName')
    protected loadUserName: ActionMethod;
    @Action('setUserName')
    protected setUserName: ActionMethod;
    @State('userName')
    protected userName: string;
    private refreshInterval: any = 0;
    @Watch('userName')
    protected onChangeUserName() {
      if (!this.userName) {
        this.$router.replace({ name: 'login' });
      }
    }
    protected async created() {
      await this.loadUserName();
      if (this.userName) {
        this.$root.$on('refresh', this.refresh);
        Indicator.open();
        await this.loadProductGroups();
        Indicator.close();
        this.refresh();
      } else {
        this.onChangeUserName();
      }
    }
    protected async refresh(showIndicator = true) {
      try {
        clearTimeout(this.refreshInterval);
        if (showIndicator) {
          Indicator.open();
        }
        await this.loadTables();
        this.refreshInterval = setTimeout(() => this.refresh(false), REFRESH_TIME);
      } finally {
        if (showIndicator) {
          Indicator.close();
        }
      }
    }
    protected async showUserNamePrompt(): Promise<void> {
      try {
        const { value }: { value: string } = await MessageBox({
          $type: 'prompt',
          title: '',
          message: '당신의 이름을 입력해주세요.',
          showCancelButton: false,
          showInput: true,
          closeOnClickModal: false,
          confirmButtonText: '확인',
        });
        if (!value) {
          return this.showUserNamePrompt();
        }
        await this.setUserName(value);
      } catch (e) {
        await MessageBox({
          title: '',
          message: e.message,
          closeOnClickModal: false,
          confirmButtonText: '확인',
        });
        return this.showUserNamePrompt();
      }
    }
  }
</script>
