<template>
  <div class="shop-item-list">
    <div>
      <span class="title">Research</span>
    </div>
    <div class="shop-item-list">
      <span class="title">Buildings</span>
      <div v-for="(building, key) in buildings" v-bind:key="key">
        <PriceTooltip :building="key" :consumables="consumables" v-if="isKnown(key)" class="shop-item-container">
          <div v-on:click="buildingClicked(key)" class="shop-item" v-bind:class="{ selected: key == buildingType }">
            <div>
              <div v-once><img class="shop-img" v-bind:src="getMapBuildingImages(key).src"></div>
            </div>
          </div>
          <div class="badge">{{ building.quantity }}</div>
        </PriceTooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Building } from '@/models/Building';
import { Habitat } from '@/models/Habitat';
import { StaticBuildingInfo, ResearchInfo } from '@/services/GameEngine'
import { Environment } from '@/models/Environment';
import { IMapTile } from '@/models/IMapTile';
import { IState, IdleGameVue } from '@/store';
import { Consumable } from '@/models/Consumable';
import { Research } from '../models/Research';
import { Keycodes } from '../models/Keycodes';

import PriceTooltip from '@/components/PriceTooltip.vue';
import { imageService } from '../services/ImageService';

@Component({
  components: {
      PriceTooltip,
  },
})
export default class ShopMenu extends IdleGameVue {
  public buildingType: Building | null = null;

  public buildingClicked(key: Building) {
    if (this.buildingType == key) {
      this.buildingType = null;
    } else {
      this.buildingType = key;
    }
    this.$emit('building-changed', key);
  }

  public isKnown(building: Building) {
    return this.$store.getters.researchBuildingsKnown[building];
  }

  public get buildings() {
    return this.$store.state.map.buildings;
  }

  public get consumables() {
    return this.$store.state.consumable;
  }

  public getMapBuildingImages(key: Building) {
    return imageService.getBuildingImage(key, 100);
  }
}
</script>

<style scoped lang="less">
.shop-item-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.shop-item-container {
  margin-top: 15px;
}

.shop-item {
  border: solid 2px #2c3e50;
  cursor: pointer;
  border-radius: 2px;
  &>div {
    height: 32px;
    width: 32px;
    border-top: solid 2px #fff;
    border-left: solid 2px #fff;
    border-bottom: solid 2px rgba(0, 0, 0, 0);
    border-right: solid 2px rgba(0, 0, 0, 0);;
    padding: 3px;
  }
}

.shop-item.selected {
  border: solid 2px #fff;
  box-shadow: 0px 0px 5px #fff;
  background-color: #f5f5f5;
  &>div {
    border-top: solid 2px #d6dbd8;
    border-left: solid 2px #d6dbd8;
  }
}

.shop-item:hover {
  background-color: #f5f5f5;
  &>div {
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