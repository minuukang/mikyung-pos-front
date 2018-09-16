<template>
  <div id="app" :class="$style.container">
    <header class="mint-header">
      <div class="mint-header-button is-left">
        <mt-button slot="left" @click="$router.back()" icon="back"></mt-button>
      </div>
      <h1 class="mint-header-title" :class="$style.title"><router-link :to="{ name: 'home' }">미.경.포.스</router-link></h1>
      <div class="mint-header-button is-right">
        <v-icon name="sync" @click.native="refresh"></v-icon>
      </div>
    </header>
    <router-view :class="$style.main" />
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
    font-weight: bold;
    font-size: 18px;
  }
  .main {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
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
    protected async created() {
      this.$root.$on('refresh', this.refresh);
      await Promise.all([
        this.loadProductGroups(),
        this.loadUserName(),
      ]);
      if (!this.userName) {
        this.$router.push({ name: 'home' });
        await this.showUserNamePrompt();
      }
      this.refresh();
    }
    protected async refresh(showIndicator = true) {
      try {
        clearTimeout(this.refreshInterval);
        showIndicator && Indicator.open();
        await this.loadTables();
        this.refreshInterval = setTimeout(() => this.refresh(false), REFRESH_TIME);
      } finally {
        showIndicator && Indicator.close();
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
        this.setUserName(value);
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
