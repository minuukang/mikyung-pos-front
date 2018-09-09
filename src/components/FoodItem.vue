<template>
  <mt-cell :title="model.productName" :label="`${model.salesAmount}원`">
    <div :class="$style.range">
      <button type="button" :class="$style.rangeButton" @click="down">-</button>
      <input type="number" :class="$style.rangeInput" v-model.number="value">
      <button type="button" :class="$style.rangeButton" @click="up">+</button>
    </div>
  </mt-cell>
</template>
<style lang="scss" module>
  .name {
    font-size: 1.5rem;
  }
  .range {
    display: flex;
    width: 15rem;
    border: 1px solid #eeeeee;
    &Button {
      background-color: #eeeeee;
      border: 0;
      width: 3rem;
    }
    &Input {
      flex: 1;
      text-align: center;
      width: 100%;
      display: block;
    }
  }
</style>
<script lang="ts">
  import { Component, Vue, Prop, Model } from 'vue-property-decorator';
  import { Food } from '../store/types'

  export interface ProductEa {
    productId: number
    ea: number
  }

  @Component({
    name: 'food-item'
  })
  export default class FoodItem extends Vue {
    @Model('input') ea: ProductEa[];
    @Prop({ required: true }) model: Food;
    get eaData (): ProductEa {
      return this.ea.find(ea => ea.productId === this.model.productId);
    }
    get value (): number {
      return this.eaData ? this.eaData.ea : 0;
    }
    set value (value: number) {
      this.$emit('input', this.ea.filter(data => data.productId !== this.model.productId).concat({
        productId: this.model.productId,
        ea: value
      }));
    }
    up () {
      this.value ++;
    }
    down () {
      if (this.value) {
        this.value --;
      }
    }
  }
</script>
