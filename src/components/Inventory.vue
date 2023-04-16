<template>
  <div class="inventory">
    <span class="title">Resources</span>
    <ul>
      <li v-for="(consumable, key) in consumables()" v-bind:key="key">
        <div class="resource-line">
          <div class="animated icon" :class="{ rubberBand: shouldBounce(key) }">
            <img v-bind:src="getIcon(key)" />
          </div>
          <div class="storage">
            {{ getValue(consumable.quantity) }} / {{ getStorage(key) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IState, IdleGameVue } from "@/store";
import { Consumable } from "@/models/Consumable";
import {
  StaticConsumableInfo,
  GlobalConfig,
  StaticBuildingInfo,
} from "@/services/GameEngine";

import ParticleEmitter from "@/components/ParticleEmitter.vue";
import { MessageService } from "@/services/MessageService";
import { Building } from "../models/Building";
import { EventBus } from "@/EventBus";
import { GameService } from "@/services/GameService";

@Component({
  components: {
    ParticleEmitter,
  },
})
export default class Inventory extends IdleGameVue {
  private _tutut: number | undefined = undefined;

  public mounted() {
    EventBus.$on(
      "consumable-production",
      (event: { [id in Consumable]: number }) => {
        this.$store.state.consumablesProduced = event;

        if (this._tutut) clearTimeout(this._tutut);

        this._tutut = setTimeout(() => {
          this.$store.commit("ResetConsumablesProduced");
          this.$forceUpdate(); // I don't know why I fucking need this faoce update but hey
        }, 500);
        //TODO FIXME CA MARCHE PAS DU TOUT ca le fait qu'une fois
      }
    );
  }

  shouldBounce(consumable: Consumable) {
    return (
      this.$store.state.consumablesProduced &&
      !!this.$store.state.consumablesProduced[consumable] &&
      this.$store.state.consumablesProduced[consumable]! > 0
    );
  }

  consumables() {
    let res: {
      [id in Consumable]?: { quantity: number; isKnown: boolean };
    } = {};

    for (let consumable in this.$store.state.consumable) {
      if (this.$store.state.consumable[consumable as Consumable].isKnown)
        res[consumable as Consumable] =
          this.$store.state.consumable[consumable as Consumable];
    }
    return res as {
      [id in Consumable]: { quantity: number; isKnown: boolean };
    };
  }

  getName(consumable: Consumable) {
    return StaticConsumableInfo[consumable].name;
  }

  getIcon(consumable: Consumable) {
    return StaticConsumableInfo[consumable].icon;
  }

  getValue(quantity: number) {
    return Math.floor(quantity);
  }

  get debugMode() {
    return this.$store.state.debugMode;
  }

  public getStorage(consumable: Consumable) {
    var storage = this.$store.getters.getRessourceStorage(consumable);
    return storage != -1 ? storage : "∞";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.inventory {
  margin-left: 10px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 15px 10px;
}
a {
  color: #42b983;
}
.production {
  color: #3a96dd;
}
.negative {
  color: red;
  background-color: rgba(255, 0, 0, 0.5);
}

.rubberBand {
  animation-name: rubberBand;
}
.animated {
  display: inline-block;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-iteration-count: 1;
}
.resource-line {
  width: 100%;
  display: flex;
  justify-content: center;
}
.icon {
  width: 32px;
  display: inline-block;
}
.icon > img {
  image-rendering: pixelated;
  width: 32px;
}
.storage {
  width: 60px;
  vertical-align: top;
  display: inline-block;
  line-height: 30px;
  font-weight: bold;
}
</style>
