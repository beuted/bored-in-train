<template>
  <div>
    <button v-on:click="toggleDebug()" class="control-debug">Debug</button>
    <button v-on:click="reset()" class="control-debug">Reset</button>
    <button v-on:click="save()" class="control-debug">Save</button>
    <span v-on:click="togglePlay()" class="control">
      <span v-if="!isPlay">▶️</span>
      <span v-if="isPlay">⏸</span>
    </span>
    <span v-on:click="toggleFastForward()" class="control">
      ⏩
    </span>
    <span>speed: x {{ gameSpeed }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IState, IdleGameVue } from "@/store";
import { Building } from "@/models/Building";
import { StoreSaver } from "@/store/storeSaver";

@Component({
  components: {},
})
export default class Controls extends IdleGameVue {
  public get isPlay() {
    return this.$store.state.controls.speed > 0;
  }

  public get gameSpeed() {
    return this.$store.state.controls.speed;
  }

  public togglePlay() {
    this.$store.commit("TogglePlay");
  }

  public toggleFastForward() {
    this.$store.commit("ToggleFastForward");
  }

  public toggleDebug() {
    this.$store.commit("ToggleDebugMode");
  }

  public reset() {
    if (confirm("Are you sure you want ot reset your game ?")) {
      StoreSaver.Reset();
    }
  }

  public save() {
    StoreSaver.Save();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.control {
  cursor: pointer;
}
.control-debug {
  margin-right: 10px;
  cursor: pointer;
}
</style>
