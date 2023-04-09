<template>
  <div class="inventory">
    <span class="title">Resources</span>
    <ul>
      <li v-for="(consumable, key) in consumables()" v-bind:key="key">
        <ParticleEmitter :consumable="key">
          <div>
            {{ getName(key) }}
            <div class="animated" :class="{ rubberBand: shouldBounce(key) }">
              <img v-bind:src="getIcon(key)" />
            </div>
            {{ getValue(consumable.quantity) }} / {{ getStorage(key) }}
          </div>
        </ParticleEmitter>
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
  public _consumablesProduced: any = {};

  public mounted() {
    this._consumablesProduced = {};
    EventBus.$on(
      "consumable-production",
      (event: { [id in Consumable]: number }) => {
        this._consumablesProduced = event;
        //TODO FIXME CA MARCHE PAS DU TOUT ca le fait qu'une fois
      }
    );
  }

  shouldBounce(consumable: Consumable) {
    return (
      this._consumablesProduced && this._consumablesProduced[consumable] > 0
    );
  }

  consumables() {
    let res: {
      [id in Consumable]?: { quantity: number; isKnown: boolean }
    } = {};

    for (let consumable in this.$store.state.consumable) {
      if (this.$store.state.consumable[consumable as Consumable].isKnown)
        res[consumable as Consumable] = this.$store.state.consumable[
          consumable as Consumable
        ];
    }
    return res as {
      [id in Consumable]: { quantity: number; isKnown: boolean }
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px;
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
</style>
