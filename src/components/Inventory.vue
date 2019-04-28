<template>
    <div class="inventory">
        <h2>Inventory</h2>
        <ul>
            <li v-for="(consummable, key) in consummables" v-bind:key="key">
                <div> {{ getName(key) }} {{ getIcon(key) }} {{ consummable.quantity }} / {{ getStorage(key) }}</div>
                <div class="production" v-bind:class="{ negative: computeProduction(key) < 0 }"> ({{ computeProduction(key) }} /sec)</div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { Consummable } from '@/models/Consummable';
import { StaticConsummableInfo, StaticJobInfo, IStorage } from '@/services/GameEngine';

@Component
export default class Inventory extends IdleGameVue {

    get consummables() {
         return this.$store.state.consummable;
    }

    getName(consummable: Consummable) {
        return StaticConsummableInfo[consummable].name;
    }

    getIcon(consummable: Consummable) {
        return StaticConsummableInfo[consummable].icon;
    }

    public computeProduction(consummable: Consummable) {
      let production = 0;
      for (let job in this.$store.state.jobs) {
          let quantity = this.$store.state.jobs[job as Job].quantity;
          let interval = StaticJobInfo[job as Job].interval;

          let consumeObj = StaticJobInfo[job as Job].consume[consummable];
          let consume = consumeObj ? consumeObj.quantity : 0;

          let produceObj = StaticJobInfo[job as Job].produce[consummable];
          let produce = produceObj ? produceObj.quantity : 0;

          production += (produce - consume) / (interval / 1000) * quantity;
      }
      return production.toFixed(2);
    }

    get debugMode() {
        return this.$store.state.debugMode;
    }

    public getStorage(consummable: string) {
        var storage = this.$store.getters.getRessourceStorage(consummable);
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
}
</style>
