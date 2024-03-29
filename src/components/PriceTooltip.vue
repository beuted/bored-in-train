<template>
  <div class="tooltip">
    <div :class="{ 'not-buildable': !isBuildable }">
      <slot></slot>
    </div>
    <span class="tooltip-content">
      <div class="tooltip-title">{{ buildingInfo.name }}</div>
      <div>{{ buildingInfo.description }}</div>
      <br />
      <div v-if="!hidePrice">
        <div class="tooltip-title">Price:</div>
        <div v-for="(value, keyPrice) in buildingInfo.price" :key="keyPrice">
          <span
            v-if="value != 0"
            :class="{ 'not-enough': hasNotEnough(keyPrice, value) }"
            ><consumable-icon :consumable="keyPrice" /> {{ value }}</span
          >
        </div>
        <br />
      </div>

      <div
        v-if="
          Object.values(buildingInfo.produce).filter((x) => x != null).length >
          0
        "
      >
        <div class="tooltip-title">Produce:</div>
        <div
          v-for="(value, keyProduce) in buildingInfo.produce"
          :key="keyProduce"
        >
          <span v-if="value != null"
            ><consumable-icon :consumable="keyProduce" />
            {{ value.quantity }}
            <span
              v-if="
                value.bonusesForAdjacentBuilding &&
                value.bonusesForAdjacentBuilding.length
              "
              v-for="(v, keyProduce) in value.bonusesForAdjacentBuilding"
            >
              + {{ v.quantity }} x <building-icon :building="v.for" />
            </span>
            <span
              v-if="
                value.bonusesForAdjacentEnvironment &&
                value.bonusesForAdjacentEnvironment.length
              "
              v-for="(v, keyProduce) in value.bonusesForAdjacentEnvironment"
            >
              + {{ v.quantity }} x <environment-icon :environment="v.for" />
            </span>
          </span>
        </div>
        <br />
      </div>

      <div
        v-if="
          Object.values(buildingInfo.consume).filter((x) => x != null).length >
          0
        "
      >
        <div class="tooltip-title">Consume:</div>
        <div
          v-for="(value, keyConsume) in buildingInfo.consume"
          :key="keyConsume"
        >
          <span v-if="value != null"
            ><consumable-icon :consumable="keyConsume" />
            {{ value.quantity }}</span
          >
        </div>
        <br />
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { IdleGameVue } from "@/store";
import { StaticBuildingInfo } from "@/services/GameEngine";
import { Building } from "@/models/Building";
import ConsumableIcon from "@/components/ConsumableIcon.vue";
import BuildingIcon from "@/components/BuildingIcon.vue";
import EnvironmentIcon from "@/components/EnvironmentIcon.vue";
import { Consumable } from "@/models/Consumable";

@Component({
  components: {
    ConsumableIcon,
    BuildingIcon,
    EnvironmentIcon,
  },
})
export default class PriceTooltip extends IdleGameVue {
  @Prop() private building!: Building;
  @Prop() public isBuildable!: boolean;
  @Prop() public hidePrice!: boolean;

  public get buildingInfo() {
    return StaticBuildingInfo[this.building];
  }

  public hasNotEnough(consumable: Consumable, price: number | undefined) {
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
.tooltip-content {
  visibility: hidden;
  width: 200px;
  left: 100%;
  top: 0%;
  margin-top: -50%; /* Use half of the width (200/2 = 100), to center the tooltip */
  margin-left: 60px;
  padding: 10px 5px;
  color: #fff;
  text-shadow: 0px 1px 1px #000;
  text-align: center;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
  z-index: 200;

  /* Position the tooltip text - see examples below! */
  position: absolute;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-content {
  visibility: visible;
}

.not-enough {
  color: red;
}
.tooltip-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.not-buildable {
  cursor: url("../../public/img/cursors/cursor-hand-can-grab.png"), auto;
  opacity: 0.3;
}
</style>
