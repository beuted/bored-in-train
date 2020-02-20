<template>
  <div class="flex-container">
    <div class="research-item-container">
      <button
        v-for="researchName of availableResearchs" v-bind:key="researchName"
        class="research-item"
        v-bind:class="{ 'owned': isResearchOwned(researchName), 'cant-afford': !canAffordResearch(researchName) }"
        v-on:click="buyResearch(researchName)"
        :disabled="isResearchOwned(researchName)">
        <div>{{ getResearchInfo(researchName).name }}</div>
        <div class="price">Price: <consumable-icon consumable="knowledge" />x {{ getResearchInfo(researchName).price }}</div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ResearchInfo, StaticConsumableInfo } from '@/services/GameEngine';
import { IState, IdleGameVue } from '@/store';
import { EventBus, IJobProductionEvent } from '@/EventBus';
import { Research } from '@/models/Research';
import { MessageService } from '@/services/MessageService';
import { Consumable } from '../models/Consumable';
import ConsumableIcon from '@/components/ConsumableIcon.vue';

@Component({
  components: {
    ConsumableIcon
  },
})
export default class ResearchComponent extends IdleGameVue {
  public get availableResearchs() {
    return this.$store.getters.availableResearchs;
  }

  public getResearchInfo(research: Research) {
    return ResearchInfo[research];
  }

  public isResearchOwned(researchName: Research) {
    return this.$store.state.research.research[researchName].owned;
  }

  public buyResearch(researchName: Research) {
    if (!this.canAffordResearch(researchName)) {
      Vue.toasted.error(`You don't have enough "knowledge" to buy this research.`);
      MessageService.Help(`In order to buy research you must have enough "knowledge". To generate some knowledge hire some druids.`, 'research');
      return;
    }

    this.$store.dispatch('BuyResearch', { researchName: researchName });
    this.$toasted.success(`You discovered ${ResearchInfo[researchName].name}!`);
  }

  public canAffordResearch(researchName: Research) {
    return ResearchInfo[researchName].price <= this.$store.state.consumable.knowledge.quantity;
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
    flex-direction: column;
    justify-content: center;
}

.research-item {
  margin: 20px;
  padding: 20px;
  border: 1px solid #2c3e50;
  cursor: pointer;
  flex-direction: column;
}

.research-item:hover {
  border: 1px solid grey;
  background-color: #EEE;
}

.research-item.cant-afford {
  border: 1px solid grey;
  background-color: #EEE;
  color: grey;
  cursor: default;
}
.research-item.owned {
  border: 1px solid green;
  background-color: lightgreen;
  cursor: default;
}

.price {
  color: #3a96dd;
}

</style>
