<template>
  <div>
    <button v-on:click="reset()" class="control-debug">Reset</button>
    <button v-on:click="save()" class="control-debug">Save</button>
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
  public reset() {
    if (confirm("Are you sure you want ot reset your game ?")) {
      StoreSaver.Reset();
    }
  }

  public save() {
    Vue.toasted.success(`Game saved`);
    StoreSaver.Save();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.control {
  cursor: url("../../public/img/cursors/cursor-hand.png"), auto;
}
.control-debug {
  margin-right: 10px;
  cursor: url("../../public/img/cursors/cursor-hand.png"), auto;
}
</style>
