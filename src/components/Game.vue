  <template>
  <div>
    <div class="flex-container">
      <div class="inventory-item">
        <ShopMenu v-on:building-changed="buildingChanged"></ShopMenu>
      </div>
      <div class="map-item">
        <Map :map="map" :buildings="buildings" :building="building" :consumables="consumables"/>
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
import { StaticConsumableInfo, IStaticConsumable, IConsuming } from '@/services/GameEngine';
import { IState, IdleGameVue } from '@/store';
import { Consumable } from '@/models/Consumable';
import { EventBus } from '@/EventBus';
import { GameService } from '@/services/GameService';

import Inventory from '@/components/Inventory.vue';
import ShopMenu from '@/components/ShopMenu.vue';
import Map from '@/components/Map.vue';
import Controls from '@/components/Controls.vue';
import { StoreSaver } from '../store/storeSaver';
import { Building } from '../models/Building';

const gameService = new GameService();

@Component({
  components: {
    ShopMenu,
    Inventory,
    Map
  },
})
export default class Game extends IdleGameVue {
  @Prop() private msg!: string;
  public building: Building | null = null;

  private get map() {
    return this.$store.state.map.map;
  }

  private get buildings() {
    return this.$store.state.map.buildings;
  }

  private get consumables() {
    return this.$store.state.consumable;
  }

  public buildingChanged(building: Building | null) {
    this.building = building;
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
  margin-top: 50px;
  width: 300px;
}
</style>
