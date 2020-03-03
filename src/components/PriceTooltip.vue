<template>
  <div class="tooltip">
    <div :class="{'not-buildable': !isBuildable}">
      <slot></slot>
    </div>
    <span class="tooltip-content">
        <div class="tooltip-title">{{ buildingInfo.name }}</div>
        <div>{{ buildingInfo.description }}</div>
        <br>
        <div>
          <div class="tooltip-title">Price:</div>
          <div v-for="(value, keyPrice) in buildingInfo.price" :key="keyPrice">
            <span v-if="value != 0"><consumable-icon :consumable="keyPrice" /> x {{ value }}</span>
          </div>
        </div>
        <br>
        <div>
          <div class="tooltip-title">Produce:</div>
          <div v-for="(value, keyProduce) in buildingInfo.produce" :key="keyProduce">
            <span v-if="value != null"><consumable-icon :consumable="keyProduce" /> x {{ value.quantity }}</span>
          </div>
        </div>
        <br>
        <div>
          <div class="tooltip-title">Consume:</div>
          <div v-for="(value, keyConsume) in buildingInfo.consume" :key="keyConsume">
            <span v-if="value != null"><consumable-icon :consumable="keyConsume" /> x {{ value.quantity }}</span>
          </div>
        </div>
      </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { Consumable } from '@/models/Consumable';
import { StaticBuildingInfo, StaticConsumableInfo } from '@/services/GameEngine';
import { Building } from '@/models/Building';
import ConsumableIcon from '@/components/ConsumableIcon.vue';

@Component({
  components: {
    ConsumableIcon
  },
})
export default class PriceTooltip extends IdleGameVue {
  @Prop() private building!: Building;
  @Prop() private isBuildable!: boolean

  public get buildingInfo() {
    return StaticBuildingInfo[this.building];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip-content {
  visibility: hidden;
  width: 200px;
  left: 100%;
  top: 0%;
  margin-top: -50%; /* Use half of the width (200/2 = 100), to center the tooltip */
  margin-left: 60px;
  padding: 5px 0;
  color: #fff;
  text-shadow: 0px 1px 1px #000;
  text-align: center;
  background-color: rgba(30, 30, 30, 0.90);
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
  z-index: 200;

  /* Position the tooltip text - see examples below! */
  position: absolute;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-content {
  visibility: visible;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.not-buildable {
  cursor: default;
  opacity: 0.3;
}
</style>
