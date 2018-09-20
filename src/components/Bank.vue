<template>
  <div :class="$style.container" @click="$emit('close', 'down')">
    <div :class="$style.view">
      <p :class="$style.name">유한욱</p>
      <p :class="$style.address">카카오뱅크 333-06-9670070</p>
    </div>
  </div>
</template>
<style lang="scss" module>
  .view {
    width: 100vh;
    height: 100vw;
    background-image: url(../assets/card.png);
    background-size: auto 100%;
    background-repeat: no-repeat;
    position: relative;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(#000, 0.25);
    background-color: #ffffff;
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0) rotate(90deg) scale(0.9);
  }
  .name {
    font-size: 24px;
    position: absolute;
    left: 20px;
    top: 20px;
  }
  .address {
    position: absolute;
    bottom: 24px;
    left: 100px;
    font-size: 22px;
  }
</style>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import Hammer from 'hammerjs';

  const directionMap: {[key: number]: string} = {
    [Hammer.DIRECTION_DOWN]: 'down',
    [Hammer.DIRECTION_UP]: 'up',
    [Hammer.DIRECTION_LEFT]: 'left',
    [Hammer.DIRECTION_RIGHT]: 'right',
  };

  @Component({
    name: 'bank-view',
  })
  export default class Bank extends Vue {
    protected mounted() {
      document.body.appendChild(this.$el);
      const hammer = new Hammer(this.$el);
      hammer.get('swipe').set({ velocity: 0.3, direction: Hammer.DIRECTION_ALL });
      hammer.on('swipe', (e) => {
        this.$emit('close', directionMap[e.direction]);
      });
    }
  }
</script>
