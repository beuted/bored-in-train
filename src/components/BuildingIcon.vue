<template>
  <img class="building-icon" :src="getBuildingIcon()" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IdleGameVue } from "@/store";
import { StaticBuildingInfo } from "@/services/GameEngine";
import { Building } from "../models/Building";

@Component({
  components: {},
})
export default class BuildingIcon extends IdleGameVue {
  @Prop() private building!: Building;

  public getBuildingIcon() {
    return StaticBuildingInfo[this.building].icon;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.building-icon {
  vertical-align: top;
  margin-right: 5px;
}
</style>
