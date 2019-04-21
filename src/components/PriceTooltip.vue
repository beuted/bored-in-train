<template>
    <div class="tooltip"><div v-bind:class="buildableClass"> <slot></slot> </div>
        <span class="tooltip-content">
            <div class="tooltip-title">Price:</div>
            <div v-for="(value, key) in priceStruct" :key="key">
                <span v-if="value != 0">{{ key }} x {{ value }}</span>
            </div>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { Consummable } from '@/models/Consummable'; // @ is an alias to /src

@Component({
  components: {
  },
})
export default class PriceTooltip extends IdleGameVue {
    @Prop() private priceStruct!: {[id in Consummable]: number};
    @Prop() private consummables!: {[id in Consummable]: { quantity: number }};

    public get buildableClass() {
        if (!this.isBuildable())
            return 'not-buildable';

        return 'buildable';
    }

    private isBuildable() {
        for (const [key, value] of Object.entries(this.priceStruct)) {
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
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltip-content {
  visibility: hidden;
  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

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
    color: red;
}
</style>
