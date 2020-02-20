<template>
  <img class="consumable-icon" :src="getConsumableIcon()" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';
import { StaticConsumableInfo } from '@/services/GameEngine';
import { Consumable } from '../models/Consumable';

@Component({
  components: {
  },
})
export default class ConsumableIcon extends IdleGameVue {
  @Prop() private consumable!: Consumable;

  public getConsumableIcon() {
    return StaticConsumableInfo[this.consumable].icon;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .consumable-icon {
    vertical-align: top;
    margin-right: 5px;
  }
</style>
