<template>
  <div class="tooltip" v-if="tile != null">
    <span class="tooltip-content" :style="getCoordStyle()">
      <div v-if="!tile.discovered && !tile.discoverable">
        <div class="tooltip-title">You haven't discovered this zone yet</div>
      </div>
      <div v-if="tile.discovered || tile.discoverable">
        <div class="tooltip-title">({{ tileCoord.x }}, {{ tileCoord.y }})</div>
        <div v-if="tile.e">
          <div class="tooltip-title">Landscape: {{ environmentName }}</div>
        </div>
        <div v-if="tile.b">
          <div class="tooltip-title">
            Building: {{ getBuildingName(tile.b) }}
          </div>
        </div>
        <div class="actions"></div>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IState, IdleGameVue } from "@/store";
import { Consumable } from "@/models/Consumable";
import { StaticBuildingInfo } from "@/services/GameEngine";
import { Building } from "@/models/Building";
import { IMapTile } from "@/models/IMapTile";
import { environmentName } from "@/models/Environment";

@Component({
  components: {},
})
export default class TileTooltip extends IdleGameVue {
  @Prop() public tile!: IMapTile | null;
  @Prop() public coord!: { x: number; y: number };
  @Prop() public tileCoord!: { x: number; y: number };

  public getCoordStyle(): string {
    return "left:" + this.coord.x + "px;top:" + this.coord.y + "px";
  }

  public getBuildingName(building: Building) {
    return StaticBuildingInfo[building].name;
  }

  public get environmentName() {
    if (this.tile == null || this.tile.e == null) return null;
    return environmentName(this.tile.e);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/* Tooltip container */
.tooltip {
  position: relative;
  top: 0;
}

/* Tooltip text */
.tooltip .tooltip-content {
  pointer-events: none; // To let click through
  width: 200px;
  top: 0;
  left: 0;
  margin-left: -100px; /* Use half of the width (200/2 = 100), to center the tooltip */
  padding: 10px 5px;
  color: #fff;
  text-shadow: 0px 1px 1px #000;
  text-align: center;
  background-color: rgba(20, 20, 20, 0.9);
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.tooltip-title {
  margin-bottom: 10px;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 5px;
}

.delete-btn {
  pointer-events: auto; // To not let click through

  border: none;
  border-radius: 2px;
  cursor: url("../../public/img/cursors/cursor-hand.png"), auto;
  background-color: transparent;
  width: 28px;
  height: 28px;
  & > img {
    width: 16px;
    height: 16px;
    image-rendering: pixelated;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
