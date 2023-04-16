<template>
  <div class="categories">
    <span v-if="availableResearchs.length > 0" class="title">Research</span>

    <div v-for="researchName of availableResearchs" v-bind:key="researchName">
      <div class="shop-item-list">
        <div
          class="shop-item-container"
          v-for="building of getResearchBuildingDependencyList(researchName)"
          v-bind:key="building.building"
        >
          <div
            class="research-dependency-item"
            v-bind:class="{ unknown: !building.known }"
          >
            <div v-once>
              <img
                class="shop-img"
                v-bind:src="getMapBuildingImages(building.building).src"
              />
            </div>
          </div>
        </div>

        <div v-if="getResearchBuildingDependencyList(researchName).length > 0">
          <img class="shop-arrow" v-bind:src="'./img/arrow-right.png'" />
        </div>

        <ResearchTooltip
          :research="researchName"
          :is-buyable="
            !isResearchOwned(researchName) && canBuyResearch(researchName)
          "
          :knowAllBuildings="knowAllBuildings(researchName)"
          class="shop-item-container"
        >
          <div v-on:click="buyResearch(researchName)" class="shop-item">
            <div v-once>
              <img
                class="shop-img"
                v-bind:src="getResearchImages(researchName).src"
              />
            </div>
          </div>
        </ResearchTooltip>
      </div>
    </div>

    <span class="title">Base buildings</span>

    <div class="shop-item-list">
      <div v-for="building in buildings()" v-bind:key="building">
        <PriceTooltip
          :building="building"
          :is-buildable="isBuildable(building)"
          class="shop-item-container"
        >
          <div
            v-on:click="buildingClicked(building)"
            class="shop-item"
            v-bind:class="{ selected: building == buildingType }"
          >
            <div>
              <div v-once>
                <img
                  class="shop-img"
                  v-bind:src="getMapBuildingImages(building).src"
                />
              </div>
            </div>
          </div>
          <div
            v-if="buildingsOnMap[building].quantity > 0 && building != 'forest'"
            class="badge"
          >
            {{ buildingsOnMap[building].quantity }}
          </div>
          <div
            class="particle-container"
            v-if="shouldShowParticles()"
            :style="{
              left: `0px`,
              top: `0px`,
            }"
          >
            <img
              class="particle"
              :src="'./img/star.png'"
              v-for="(particle, i) of new Array(10)"
              v-bind:key="i"
              :style="{
                transform: `translate(${200 * Math.random() - 100 + 100}px, ${
                  200 * Math.random() - 100 + 100
                }px)`,
                'animation-duration': 0.5 * Math.random() + 0.3 + 's',
                'animation-delay': 0 + 's',
              }"
            />
          </div>
        </PriceTooltip>
      </div>
    </div>
    <span class="title" v-if="knownTransformations().length > 0"
      >Known transformations</span
    >
    <div class="shop-item-list">
      <div v-for="building in knownTransformations()" v-bind:key="building">
        <PriceTooltip
          :building="building"
          :is-buildable="true"
          :hide-price="true"
          class="shop-item-container"
        >
          <div
            class="known-item"
            v-bind:class="{ selected: building == buildingType }"
          >
            <div>
              <div v-once>
                <img
                  class="shop-img"
                  v-bind:src="getMapBuildingImages(building).src"
                />
              </div>
            </div>
          </div>
          <div
            class="particle-container"
            v-if="shouldShowParticles()"
            :style="{
              left: `0px`,
              top: `0px`,
            }"
          >
            <img
              class="particle"
              :src="'./img/star.png'"
              v-for="(particle, i) of new Array(10)"
              v-bind:key="i"
              :style="{
                transform: `translate(${200 * Math.random() - 100 + 100}px, ${
                  200 * Math.random() - 100 + 100
                }px)`,
                'animation-duration': 0.5 * Math.random() + 0.3 + 's',
                'animation-delay': 0 + 's',
              }"
            />
          </div>
        </PriceTooltip>
      </div>
    </div>
    <Controls class="controls" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Building } from "@/models/Building";
import { StaticBuildingInfo, ResearchInfo } from "@/services/GameEngine";
import { IState, IdleGameVue } from "@/store";
import { Consumable } from "@/models/Consumable";
import { Research } from "../models/Research";

import PriceTooltip from "@/components/PriceTooltip.vue";
import ResearchTooltip from "@/components/ResearchTooltip.vue";
import { imageService } from "../services/ImageService";
import { MessageService } from "@/services/MessageService";
import Controls from "./Controls.vue";

@Component({
  components: {
    ResearchTooltip,
    PriceTooltip,
    Controls,
  },
})
export default class ShopMenu extends IdleGameVue {
  @Prop() public buildingType: Building | null = null;

  // Research
  public get availableResearchs() {
    return this.$store.getters.availableResearchs.filter(
      (key: Research) => !this.isResearchOwned(key)
    );
  }

  public getResearchInfo(research: Research) {
    return ResearchInfo[research];
  }

  public isResearchOwned(researchName: Research) {
    return this.$store.state.research.research[researchName].owned;
  }

  public buyResearch(researchName: Research) {
    if (!this.canBuyResearch(researchName)) {
      Vue.toasted.error(
        `You don't have enough "knowledge" to buy this research.`
      );
      MessageService.Help(
        `In order to buy research you must have enough "knowledge". To generate some knowledge hire some druids.`,
        "research"
      );
      return;
    }

    this.$store.dispatch("BuyResearch", { researchName: researchName });
    let newBuilding = ResearchInfo[researchName].unlocks
      .buildings[0] as Building;
    this.$toasted.success(
      `You discovered ${ResearchInfo[researchName].name}! You can now create ${StaticBuildingInfo[newBuilding].name}.`
    );
    this.$forceUpdate();
  }

  public canBuyResearch(researchName: Research) {
    for (let building of ResearchInfo[researchName].neededBuildings) {
      if (!this.$store.state.research.buildingsKnown[building]) return false;
    }

    for (let consumable in ResearchInfo[researchName].price) {
      if (
        ResearchInfo[researchName].price[consumable as Consumable]! >
        this.$store.state.consumable[consumable as Consumable].quantity
      )
        return false;
    }

    return true;
  }

  public knowAllBuildings(researchName: Research) {
    for (let building of ResearchInfo[researchName].neededBuildings) {
      if (!this.$store.state.research.buildingsKnown[building]) return false;
    }
    return true;
  }

  public getResearchImages(key: Research) {
    return imageService.getResearchImages(key);
  }

  // buildings
  public buildingClicked(key: Building) {
    if (this.buildingType == key) {
      this.$emit("building-changed", null);
    } else if (this.isBuildable(key)) {
      this.$emit("building-changed", key);
    }
  }

  public isKnown(building: Building) {
    return this.$store.getters.researchBuildingsKnown[building];
  }

  public buildings(): Building[] {
    console.log("can be built");
    return Object.keys(this.$store.state.research.buildingsKnown).filter(
      (building) =>
        this.$store.state.research.buildingsKnown[building as Building] &&
        StaticBuildingInfo[building as Building].canBeBuilt
    ) as Building[];
  }

  public get buildingsOnMap() {
    return this.$store.state.map.buildings;
  }

  public knownTransformations(): Building[] {
    return Object.keys(this.$store.state.research.buildingsKnown).filter(
      (building) =>
        this.$store.state.research.buildingsKnown[building as Building] &&
        !StaticBuildingInfo[building as Building].canBeBuilt
    ) as Building[];
  }

  public getMapBuildingImages(key: Building) {
    return imageService.getBuildingImage(key, 100);
  }

  public isBuildable(building: Building) {
    for (const key in StaticBuildingInfo[building].price) {
      var value = StaticBuildingInfo[building].price[key as Consumable];
      if (
        value != undefined &&
        this.$store.state.consumable[key as Consumable].quantity < value
      )
        return false;
    }
    return true;
  }

  public getResearchBuildingDependencyList(research: Research) {
    return ResearchInfo[research].neededBuildings.map((b) => ({
      building: b,
      known: this.$store.state.research.buildingsKnown[b],
    }));
  }

  public shouldShowParticles() {
    return true;
  }
}
</script>

<style scoped lang="less">
.categories {
  display: flex;
  flex-direction: column;
  justify-content: space;
  align-items: center;
}

.shop-item-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  width: 250px;
}

.shop-item-container {
  margin: 15px 8px 5px 0px;
  position: relative;
}

.shop-item {
  border: solid 2px #2c3e50;
  cursor: url("../../public/img/cursors/cursor-hand.png"), auto;
  border-radius: 2px;
  & > div {
    height: 32px;
    width: 32px;
    border-top: solid 2px #fff;
    border-left: solid 2px #fff;
    border-bottom: solid 2px rgba(0, 0, 0, 0);
    border-right: solid 2px rgba(0, 0, 0, 0);
    padding: 3px;
  }
}

.shop-item.selected {
  border: solid 2px #00a6c6;
  box-shadow: 0px 0px 5px #fff;
  background-color: #e1f4f7;
  & > div {
    border: solid 2px #f5f5f5;
  }
}

.shop-item:hover {
  border: solid 2px #d6dbd8;
  box-shadow: 0px 0px 5px #fff;
  background-color: #d6dbd8;
  & > div {
    border: solid 2px #f5f5f5;
  }
}

.known-item {
  background-color: #f5f5f5;
  cursor: url("../../public/img/cursors/cursor-hand-can-grab.png"), auto;
  border-radius: 2px;
  & > div {
    height: 32px;
    width: 32px;
    border-top: solid 2px #f5f5f5;
    border-left: solid 2px #f5f5f5;
    border-bottom: solid 2px #f5f5f5;
    border-right: solid 2px #f5f5f5;
    padding: 3px;
  }
}

.known-item:hover {
  background-color: #d6dbd8;
}

.research-dependency-item {
  background-color: #f5f5f5;
  cursor: url("../../public/img/cursors/cursor-hand-can-grab.png"), auto;
  border-radius: 2px;
  & > div {
    height: 32px;
    width: 32px;
    border-top: solid 2px #f5f5f5;
    border-left: solid 2px #f5f5f5;
    border-bottom: solid 2px #f5f5f5;
    border-right: solid 2px #f5f5f5;
    padding: 3px;
  }
}
.research-dependency-item.unknown {
  border: solid 2px #fff;
  box-shadow: 0px 0px 5px #fff;
  background-color: #f5f5f5;
  & > div {
    border-top: solid 2px #d6dbd8;
    border-left: solid 2px #d6dbd8;
    & > img {
      filter: contrast(0);
    }
  }
}

.badge {
  position: absolute;
  top: -9px;
  right: -9px;
  background-color: #3a96dd;
  height: 18px;
  width: 18px;
  border-radius: 9px;
  font-size: 10px;
  line-height: 18px;
  color: white;
  z-index: 10;
}

.shop-img {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}

.shop-arrow {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  margin-top: 8px;
  margin-right: 8px;
}

input {
  visibility: hidden;
  width: 0;
  height: 0;
  margin: 0;
}

.particle-container {
  background-color: red;
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
  z-index: 100;
}

@d: 32px;

.particle {
  position: absolute;
  left: -100px;
  top: -100px;
  width: @d;
  height: @d;
  animation: shoot 3s ease-out;
  animation-name: shoot, fade;
  image-rendering: pixelated;
  opacity: 0;
}

@keyframes shoot {
  0% {
    transform: translate(100px, 100px);
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
