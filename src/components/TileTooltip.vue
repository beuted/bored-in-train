<template>
    <div class="tooltip">
        <span class="tooltip-content">
            <div class="tooltip-title">Environment:</div>
            <br>
            <div class="tooltip-title">Building:</div>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { Consummable } from '@/models/Consummable';
import { StaticBuildingInfo } from '@/services/GameEngine';
import { Building } from '@/models/Building';
import { IMapTile } from '../models/IMapTile';

@Component({
  components: {
  },
})
export default class TileTooltip extends IdleGameVue {
    @Prop() private tile!: IMapTile;
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
  width: 200px;
  bottom: 100%;
  left: 50%;
  margin-left: -100px; /* Use half of the width (200/2 = 100), to center the tooltip */
  background-color: white;
  color: #2c3e50;
  text-align: center;
  padding: 5px 0;
  border-radius: 2px;
  border: 1px solid #2c3e50;
  box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.tooltip-title {
    font-weight: bold;
    margin-bottom: 10px;
}
</style>
