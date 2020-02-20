<template>
    <div v-once class="tooltip"><div> <slot></slot> </div>
        <span class="tooltip-content">
            <div>
                <div class="tooltip-title">{{ name }}</div>
                <div> {{ description }}</div>
                <div class="tooltip-title">Produce:</div>
                <div v-for="(value, key) in produce" :key="key">
                    <span v-if="value != null"><img class="consummable-icon" :src="getConsummableIcon(key)" /> x {{ value.quantity }}</span>
                </div>
            </div>
            <div>
                <div class="tooltip-title">Consume:</div>
                <div v-for="(value, key) in consume" :key="key">
                    <span v-if="value != null"><img class="consummable-icon" :src="getConsummableIcon(key)" />x {{ value.quantity }}</span>
                </div>
            </div>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { StaticJobInfo, StaticConsummableInfo } from '@/services/GameEngine';
import { Consummable } from '../models/Consummable';

@Component({
  components: {
  },
})
export default class JobTooltip extends IdleGameVue {
    @Prop() private jobName!: Job;

    public getConsummableIcon(consummable: Consummable) {
        return StaticConsummableInfo[consummable].icon;
    }

    public get name() {
        return StaticJobInfo[this.jobName].name;
    }

    public get description() {
        return StaticJobInfo[this.jobName].description;
    }

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
  border-bottom: 1px dotted #2c3e50; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltip-content {
  visibility: hidden;
  width: 200px;
  bottom: 100%;
  left: 50%;
  margin-left: -100px; /* Use half of the width (200/2 = 100), to center the tooltip */
  padding: 5px;
  color: #fff;
  text-align: center;
  text-shadow: 0px 1px 1px #000;
  text-align: center;
  background-color: rgba(20, 20, 20, 0.90);
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
    margin-bottom: 5px;
    margin-top: 5px;
}

.not-buildable {
    color: red;
}

.consummable-icon {
    vertical-align: top;
    margin-right: 5px;
}
</style>
