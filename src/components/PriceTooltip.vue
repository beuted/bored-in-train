<template>
    <div v-once class="tooltip"> <slot></slot>
        <span class="tooltip-content">
            <div class="tooltip-title">Price:</div>
            <div v-for="(value, key) in priceStruct" :key="key">
                <span v-if="value != 0">{{ key }} x {{ value }}</span>
            </div>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { consummable } from '@/store'; // @ is an alias to /src

@Component({
  components: {
  },
})
export default class PriceTooltip extends Vue {
    @Prop() private priceStruct!: {[id in consummable]: number};
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
</style>
