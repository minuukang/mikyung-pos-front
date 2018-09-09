<template>
  <div id="app">
    <mt-header title="미.경.포.스">
      <mt-button slot="left" @click="$router.back()" icon="back"></mt-button>
      <mt-button slot="right" @click="refresh" icon="more"></mt-button>
    </mt-header>
    <router-view/>
  </div>
</template>
<style lang="scss" src="./style.scss"></style>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, State } from 'vuex-class';
  import { ActionMethod } from 'vuex';
  import { Indicator, MessageBox } from 'mint-ui';

  @Component({
    components: {
    },
  })
  export default class App extends Vue {
    @Action('loadProductGroups') loadProductGroups: ActionMethod
    @Action('loadTables') loadTables: ActionMethod
    @Action('loadUserName') loadUserName: ActionMethod
    @Action('setUserName') setUserName: ActionMethod
    @State('userName') userName: string
    async created () {
      await this.refresh()
    }
   async refresh () {
      try {
        Indicator.open();
        await Promise.all([
          this.loadProductGroups(),
          this.loadTables(),
          this.loadUserName()
        ]);
        if (!this.userName) {
          this.$router.push({ name: 'home' })
          this.showUserNamePrompt()
        }
      } finally {
        Indicator.close();
      }

    }
    showUserNamePrompt () {
      MessageBox({
        $type: 'prompt',
        title: '',
        message: '당신의 이름을 입력해주세요.',
        showCancelButton: false,
        showInput: true,
        confirmButtonText: '확인'
      }).then(({ value, action }) => {
        if (!value) {
          return this.showUserNamePrompt()
        }
        this.setUserName(value)
      });
    }
  }
</script>
