<template>
  <div>
    <h1>Research</h1>

    <div class="flex-container">
      <div
        v-for="(research, researchName) in researchInfos" v-bind:key="researchName"
        class="research-item"
        v-bind:class="{ owned: isResearchOwned(researchName) }"
        v-on:click="buyResearch(researchName)">
        <div>{{ research.name }}</div>
        <div class="price">Price: {{ research.price }} x 🔬</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ResearchInfo } from '@/services/GameEngine';
import { IState, IdleGameVue } from '@/store';
import { EventBus, IJobProductionEvent } from '@/EventBus';
import { Research } from '@/models/Research';

@Component({
  components: {
  },
})
export default class ResearchComponent extends IdleGameVue {
  public get researchInfos() {
    return ResearchInfo;
  }

  public isResearchOwned(researchName: Research) {
    return this.$store.state.research.research[researchName].owned;
  }

  public buyResearch(researchName: Research) {
    this.$store.commit('BuyResearch', { researchName: researchName });
    this.$toasted.success(`You discovered ${ResearchInfo[researchName].name}!`);
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
    flex-direction: row;
    justify-content: center;
}

.research-item {
  margin: 20px;
  padding: 20px;
  border: 1px solid black;
  cursor: pointer;
  flex-direction: column;
}

.research-item:hover {
  border: 1px solid grey;
  background-color: #EEE;
}

.research-item.owned {
  border: 1px solid grey;
  background-color: #EEE;
  color: grey
}

.price {
  color: #3a96dd;
}

</style>
