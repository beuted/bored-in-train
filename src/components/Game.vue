<template>
  <div class="flex-container-container">
    <div class="flex-container">
      <div class="inventory-item">
        <ShopMenu
          :buildingType="building"
          v-on:building-changed="buildingChanged"
        ></ShopMenu>
      </div>
      <div class="map-item">
        <div class="title">Our wonderful planet</div>
        <div class="winning-overlay" v-if="hasWonTheGame">
          <span
            >Humans managed to leave the planet before depleting all resources.
            Hopefuly they will reach a new planet and have a more sustainable
            exploitation of the resources there...</span
          >
          <button v-on:click="reset()" class="control-debug">
            Land on the new planet
          </button>
        </div>
        <Map
          :map="map"
          :buildings="buildings"
          :building="building"
          :consumables="consumables"
          v-on:clear-building="clearBuilding"
        />
      </div>
      <div class="inventory-item-right">
        <Inventory />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IdleGameVue } from "@/store";
import { GameService } from "@/services/GameService";

import Inventory from "@/components/Inventory.vue";
import ShopMenu from "@/components/ShopMenu.vue";
import Map from "@/components/Map.vue";
import { Building } from "../models/Building";
import { StoreSaver } from "@/store/storeSaver";

const gameService = new GameService();

@Component({
  components: {
    ShopMenu,
    Inventory,
    Map,
  },
})
export default class Game extends IdleGameVue {
  @Prop() private msg!: string;
  public building: Building | null = null;

  public get map() {
    return this.$store.state.map.map;
  }

  public get buildings() {
    return this.$store.state.map.buildings;
  }

  public get consumables() {
    return this.$store.state.consumable;
  }

  public get hasWonTheGame() {
    return this.$store.state.hasWonTheGame;
  }

  public buildingChanged(building: Building | null) {
    this.building = building;
  }

  public clearBuilding() {
    this.building = null;
  }

  public reset() {
    if (confirm("Land on the new planete ?")) {
      StoreSaver.Reset();
    }
  }

  public mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.flex-container-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.flex-container {
  padding: 30px 0 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.map-item > .title {
  margin-bottom: 15px;
}

.inventory-item {
  width: 400px;
}

.inventory-item-right {
  width: 300px;
}

.winning-overlay {
  width: 560px;
  height: 560px;
  padding: 40px;
  background-color: black;
  color: white;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 25px;

  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 2s;
}

.winning-overlay > button {
  margin-top: 50px;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
