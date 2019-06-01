  <template>
  <div>
    <h1>{{ msg }} <button v-on:click="toggleDebug()">Debug</button> <button v-on:click="reset()">Reset</button></h1>

    <Controls />
    <div class="flex-container">
      <div class="job-item">
        <Jobs />
      </div>
      <div class="map-item">
        <Map :map="map" :buildings="buildings" :consummables="consummables"/>
      </div>
      <div class="inventory-item">
        <Inventory />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { StaticConsummableInfo, IStaticConsummable, IConsuming, StaticJobInfo, IStaticJobInfo, IStaticJob, IStaticJobProduction } from '@/services/GameEngine';
import { IState, IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { Consummable } from '@/models/Consummable';
import { EventBus, IJobProductionEvent } from '@/EventBus';
import { GameService } from '@/services/GameService';

import Jobs from '@/components/Jobs.vue';
import Inventory from '@/components/Inventory.vue';
import Map from '@/components/Map.vue';
import Controls from '@/components/Controls.vue';

const gameService = new GameService();

@Component({
  components: {
    Jobs,
    Inventory,
    Map,
    Controls
  },
})
export default class Game extends IdleGameVue {
  @Prop() private msg!: string;

  private get map() {
    return this.$store.state.map.map;
  }

  private get buildings() {
    return this.$store.state.map.buildings;
  }

  private get consummables() {
    return this.$store.state.consummable;
  }

  public toggleDebug() {
    this.$store.commit('ToggleDebugMode');
  }

  public reset() {
    window.localStorage.removeItem('boring-idle-game');
    location.reload();
  }

  public mounted() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.flex-container {
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.inventory-item {
  margin-top: 60px;
  width: 300px;
}
.job-item {
  margin-top: 60px;
  width: 300px;
}
.map-item {

}
</style>
