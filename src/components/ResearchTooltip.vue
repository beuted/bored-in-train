<template>
  <div class="tooltip">
    <div :class="{ 'not-buildable': !isBuyable }">
      <slot></slot>
    </div>
    <span class="tooltip-content">
      <div class="tooltip-title">{{ researchInfo.name }}</div>
      <div>{{ researchInfo.description }}</div>
      <br />
      <div>
        <div class="tooltip-title">Price:</div>

        <div v-for="(value, keyPrice) in researchInfo.price" :key="keyPrice">
          <span
            v-if="value != 0"
            :class="{ 'not-enough': hasNotEnough(keyPrice, value) }"
            ><consumable-icon :consumable="keyPrice" /> {{ value }}</span
          >
        </div>
        <br />
        <div class="not-enough" v-if="!knowAllBuildings">
          There are buildings that you need to discover before
        </div>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { IdleGameVue } from "@/store";
import { ResearchInfo } from "@/services/GameEngine";
import ConsumableIcon from "@/components/ConsumableIcon.vue";
import { Research } from "../models/Research";
import { Consumable } from "@/models/Consumable";

@Component({
  components: {
    ConsumableIcon,
  },
})
export default class ResearchTooltip extends IdleGameVue {
  @Prop() private research!: Research;
  @Prop() public isBuyable!: boolean;
  @Prop() public knowAllBuildings!: boolean;

  public get researchInfo() {
    return ResearchInfo[this.research];
  }
  public hasNotEnough(
    consumable: Consumable,
    price: number | undefined
  ): boolean {
    return this.$store.state.consumable[consumable].quantity < (price || 0);
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
.tooltip .tooltip-content {
  visibility: hidden;
  width: 200px;
  left: 100%;
  top: 0%;
  margin-top: -50%; /* Use half of the width (200/2 = 100), to center the tooltip */
  margin-left: 15px;
  padding: 10px 5px;
  color: #fff;
  text-shadow: 0px 1px 1px #000;
  text-align: center;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
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
  cursor: url("../../public/img/cursors/cursor-hand-can-grab.png"), auto;
  opacity: 0.3;
}
.not-enough {
  color: red;
}
</style>
