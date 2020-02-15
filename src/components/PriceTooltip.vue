<template>
    <div class="tooltip"><div v-bind:class="buildableClass"> <slot></slot> </div>
        <span class="tooltip-content">
            <div class="tooltip-title">{{ buildingInfo.name }}</div>
            <div>{{ buildingInfo.description }}</div>
            <br>
            <div class="tooltip-title">Price:</div>
            <div v-for="(value, key) in buildingInfo.price" :key="key">
                <span v-if="value != 0">{{ key }} x {{ value }}</span>
            </div>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { Consummable } from '@/models/Consummable';
import { StaticBuildingInfo } from '@/services/GameEngine';
import { Building } from '@/models/Building';

@Component({
  components: {
  },
})
export default class PriceTooltip extends IdleGameVue {
    @Prop() private building!: Building;
    @Prop() private consummables!: {[id in Consummable]: { quantity: number }};

    public get buildableClass() {
        if (!this.isBuildable())
            return 'not-buildable';

        return 'buildable';
    }

    public get buildingInfo() {
        return StaticBuildingInfo[this.building];
    }

    private isBuildable() {
        for (const key in StaticBuildingInfo[this.building].price) {
            var value = StaticBuildingInfo[this.building].price[key as Consummable];
            if (this.consummables[key as Consummable].quantity < value)
                return false;
        }
        return true;
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
  bottom: 100%;
  left: 50%;
  margin-left: -100px; /* Use half of the width (200/2 = 100), to center the tooltip */
  padding: 5px 0;
  color: #fff;
  text-shadow: 0px 1px 1px #000;
  text-align: center;
  background-color: rgba(30, 30, 30, 0.90);
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);

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
    opacity: 0.3;
}
</style>
