<template>
  <div>
    <span class="title">Buildings</span>
    <div v-for="(building, key) in buildings" v-bind:key="key">
      <div class="shop-item" v-if="isKnown(key)">
        <input type="radio" :id="key" :value="key" v-model="buildingType" v-on:click="buildingClicked(key)">
        <label :for="key">
          <PriceTooltip :building="key" :consumables="consumables">
            <div v-once><img class="shop-img" v-bind:src="getMapBuildingImages(key).src"></div><div class="badge">{{ building.quantity }}</div>
          </PriceTooltip>
        </label>
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
.shop-item {
  margin-top: 15px;
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
label {
    cursor: pointer;
    margin: 0 10px 0 10px;
}
input:checked + label {
    border-bottom: 3px solid #3a96dd;
}
</style>