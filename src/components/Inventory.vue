<template>
    <div class="inventory">
        <span class="title">Inventory</span>
        <ul>
            <li v-for="(consumable, key) in consumables" v-bind:key="key" >
                <ParticleEmitter :consumable="key">
                    <div> {{ getName(key) }} <img v-bind:src="getIcon(key)"> {{ consumable.quantity }} / {{ getStorage(key) }}</div>
                </ParticleEmitter>
                <div class="production" v-bind:class="{ negative: computeProduction(key) < 0 }"> ({{ computeProduction(key) }} /sec)</div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { Consumable } from '@/models/Consumable';
import { StaticConsumableInfo, GlobalConfig, StaticBuildingInfo } from '@/services/GameEngine';

import ParticleEmitter from '@/components/ParticleEmitter.vue';
import { MessageService } from '@/services/MessageService';
import { Building } from '../models/Building';

@Component({
  components: {
      ParticleEmitter
  },
})
export default class Inventory extends IdleGameVue {

    get consumables() {
         return this.$store.state.consumable;
    }

    getName(consumable: Consumable) {
        return StaticConsumableInfo[consumable].name;
    }

    getIcon(consumable: Consumable) {
        return StaticConsumableInfo[consumable].icon;
    }

    public computeProduction(consumable: Consumable) {
        let production = 0;
        for (let building in this.$store.state.map.buildings) {
            let quantity = this.$store.state.map.buildings[building as Building].quantity;

            let consumeObj = StaticBuildingInfo[building as Building].consume[consumable];
            let consume = consumeObj ? consumeObj.quantity : 0;

            let produceObj = StaticBuildingInfo[building as Building].produce[consumable];
            let produce = produceObj ? produceObj.quantity : 0;

            production += (produce - consume) / (GlobalConfig.TickInterval / 1000) * quantity;
        }

        if (production < -0.01) {
            MessageService.Help(`Be careful! You have reached a negative production of ${consumable}. Either try to produce more of this ressource or remove some workers to consume less of it.`, 'negative-'+consumable);
        }
        var result = production.toFixed(2);
        // Avoid "negative zero"
        if (result == '-0.00')
            return '0.00';
        return result
    }

    get debugMode() {
        return this.$store.state.debugMode;
    }

    public getStorage(consumable: Consumable) {
        if (consumable == Consumable.population)
            return this.$store.state.popStorage;
        var storage = this.$store.getters.getRessourceStorage(consumable);
        return storage != -1 ? storage : '∞';
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
</style>
