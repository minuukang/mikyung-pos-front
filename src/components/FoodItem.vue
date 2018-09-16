<template>
  <mt-cell :class="$style.container" :title="model.productName" :label="`${$options.filters.numberFormat(model.salesAmount)}원`">
    <div :class="$style.range">
      <button type="button" :class="$style.rangeButton" @click="down"><v-icon name="minus"></v-icon></button>
      <input type="number" :class="$style.rangeInput" v-model.number="value">
      <button type="button" :class="$style.rangeButton" @click="up"><v-icon name="plus"></v-icon></button>
    </div>
  </mt-cell>
</template>
<style lang="scss" module>
  .container {
    min-height: 60px !important;
  }
  .name {
    font-size: 15px;
  }
  .range {
    display: flex;
    width: 120px;
    border: 1px solid #eeeeee;
    height: 30px;
    &Button {
      background-color: #eeeeee;
      width: 30px;
      height: 100%;
      > * {
        pointer-events: none;
      }
    }
    &Input {
      flex: 1;
      text-align: center;
      width: 100%;
      display: block;
      border: 0;
      box-shadow: none;
      background-color: transparent;
      appearance: none;
    }
  }
</style>
<script lang="ts">
  import { Component, Vue, Prop, Model } from 'vue-property-decorator';
  import { Product } from '../store/types';

  export interface ProductEa {
    productId: number;
    ea: number;
  }

  @Component({
    name: 'food-item',
  })
  export default class FoodItem extends Vue {
    @Model('input')
    protected ea: ProductEa[];
    @Prop({ required: true })
    protected model: Product;
    get eaData(): ProductEa {
      return this.ea.find((ea) => ea.productId === this.model.productId) as ProductEa;
    }
    get value(): number {
      return this.eaData ? this.eaData.ea : 0;
    }
    set value(value: number) {
      this.$emit('input', this.ea.filter((data) => data.productId !== this.model.productId).concat({
        productId: this.model.productId,
        ea: value,
      }));
    }
    protected up() {
      this.value ++;
    }
    protected down() {
      if (this.value) {
        this.value --;
      }
    }
  }
</script>
