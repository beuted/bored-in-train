<template>
    <div v-once class="tooltip"><div> <slot></slot> </div>
        <span class="tooltip-content">
            <div>
                <div class="tooltip-title">Produce:</div>
                <div v-for="(value, key) in produce" :key="key">
                    <span v-if="value != null">{{ key }} x {{ value.quantity }}</span>
                </div>
            </div>
            <div>
                <div class="tooltip-title">Consume:</div>
                <div v-for="(value, key) in consume" :key="key">
                    <span v-if="value != null">{{ key }} x {{ value.quantity }}</span>
                </div>
            </div>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { StaticJobInfo } from '@/services/GameEngine';

@Component({
  components: {
  },
})
export default class JobTooltip extends IdleGameVue {
    @Prop() private jobName!: Job;

    public get produce() {
        return StaticJobInfo[this.jobName].produce;
    }

    public get consume() {
        return StaticJobInfo[this.jobName].consume;
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
    margin-bottom: 5px;
    margin-top: 5px;
}

.not-buildable {
    color: red;
}
</style>
