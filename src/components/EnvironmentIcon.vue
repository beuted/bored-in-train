<template>
  <img class="environment-icon" :src="getEnvironmentIcon()" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IdleGameVue } from "@/store";
import { StaticEnvironmentInfo } from "@/services/GameEngine";
import { Environment } from "@/models/Environment";

@Component({
  components: {},
})
export default class EnvironmentIcon extends IdleGameVue {
  @Prop() private environment!: Environment;

  public getEnvironmentIcon() {
    return StaticEnvironmentInfo[this.environment].icons[0];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.environment-icon {
  vertical-align: top;
  margin-right: 5px;
}
</style>
