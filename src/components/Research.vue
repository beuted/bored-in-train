<template>
  <div>
    <h1>Research</h1>

    <div class="flex-container">
      <div v-for="(research, researchName) in researches" v-bind:key="researchName" class="research-item">
        {{ research.name }}
        Price: {{ research.price }} x 🔬
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

@Component({
  components: {
  },
})
export default class Research extends IdleGameVue {
  
  get researches() {
    return ResearchInfo;
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
}

</style>
