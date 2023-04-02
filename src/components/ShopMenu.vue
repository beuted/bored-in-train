<template>
  <div class="categories">
    <span class="title">Research</span>
    <div class="shop-item-list">
      <div v-for="researchName of availableResearchs" v-bind:key="researchName">
        <ResearchTooltip
          :research="researchName"
          :is-buyable="
            !isResearchOwned(researchName) && canAffordResearch(researchName)
          "
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
    <span class="title">Buildings</span>
    <div class="shop-item-list">
      <div v-for="(building, key) in buildings" v-bind:key="key">
        <PriceTooltip
          :building="key"
          :is-buildable="isBuildable(key)"
          v-if="isKnown(key)"
          class="shop-item-container"
        >
          <div
            v-on:click="buildingClicked(key)"
            class="shop-item"
            v-bind:class="{ selected: key == buildingType }"
          >
            <div>
              <div v-once>
                <img
                  class="shop-img"
                  v-bind:src="getMapBuildingImages(key).src"
                />
              </div>
            </div>
          </div>
          <div v-if="building.quantity > 0 && key != 'forest'" class="badge">
            {{ building.quantity }}
          </div>
        </PriceTooltip>
      </div>
    </div>
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

@Component({
  components: {
    ResearchTooltip,
    PriceTooltip,
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
    if (!this.canAffordResearch(researchName)) {
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
    this.$toasted.success(`You discovered ${ResearchInfo[researchName].name}!`);
  }

  public canAffordResearch(researchName: Research) {
    return (
      ResearchInfo[researchName].price <=
      this.$store.state.consumable.knowledge.quantity
    );
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

  public get buildings() {
    return this.$store.state.map.buildings;
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
  width: 170px;
}

.shop-item-container {
  margin: 15px 8px 5px 0px;
}

.shop-item {
  border: solid 2px #2c3e50;
  cursor: pointer;
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
  border: solid 2px #fff;
  box-shadow: 0px 0px 5px #fff;
  background-color: #f5f5f5;
  & > div {
    border-top: solid 2px #d6dbd8;
    border-left: solid 2px #d6dbd8;
  }
}

.shop-item:hover {
  background-color: #f5f5f5;
  & > div {
    border-top: solid 2px #d6dbd8;
    border-left: solid 2px #d6dbd8;
  }
}

.badge {
  position: absolute;
  top: -11px;
  right: -11px;
  background-color: #3a96dd;
  height: 22px;
  width: 22px;
  border-radius: 11px;
  font-size: 12px;
  line-height: 22px;
  color: white;
  z-index: 10;
}

.shop-img {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}

input {
  visibility: hidden;
  width: 0;
  height: 0;
  margin: 0;
}
</style>
