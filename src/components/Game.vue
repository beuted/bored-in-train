<template>
  <div>
    <h1>{{ msg }} <button v-on:click="toggleDebug()">Debug</button></h1>

    <div class="flex-container">
      <div class="job-item">
        <Jobs />
      </div>
      <div class="map-item">
        <Map />
      </div>
      <div class="inventory-item">
        <Inventory />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import Jobs from '@/components/Jobs.vue';
import Inventory from '@/components/Inventory.vue';
import Storage from '@/components/Storage.vue';
import Map from '@/components/Map.vue';
import { StaticConsummableInfo, IStaticConsummable, IConsuming, StaticJobInfo, IStaticJobInfo, IStaticJob, IStaticJobProduction } from '@/services/GameEngine';
import { IState, IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { Consummable } from '@/models/Consummable';
import { EventBus, IJobProductionEvent } from '@/EventBus';

@Component({
  components: {
    Jobs,
    Inventory,
    Storage,
    Map,
  },
})
export default class Game extends IdleGameVue {
  @Prop() private msg!: string;

  private readonly TickInterval = 1000;
  private readonly StarvationFactor = 0.5; // Portion of disapearing goods when missing consummable
  private readonly LackOfStorageFactor = 1.0; // Portion of disapearing goods when missing storage

  public toggleDebug() {
      this.$store.commit('ToggleDebugMode');
  }

  public mounted() {
    console.log(`I'm bored in a train`);

    setInterval (() => {
        let store: Store<IState> = this.$store;

        // First the creation of ressources
        for (let jobId in StaticJobInfo) {
            let staticJob: IStaticJob = StaticJobInfo[jobId as Job]; //TODO: fix typeing weirdlness

            // Create ProductionEvent
            var event: IJobProductionEvent = {
                job: jobId as Job,
                produced: {
                    population: 0,
                    food: 0,
                    sticks: 0,
                    stones: 0,
                    coals: 0
                }
            }

            if (store.state.jobs[jobId as Job].remainingTime > 0) {
                store.commit('TickInterval', { job: jobId });
                continue;
            }

            store.commit('ResetInterval', { job: jobId });

            for (let consummableId in staticJob.produce) {
                let staticJobProduction: IStaticJobProduction | null = staticJob.produce[consummableId as Consummable];
                if (staticJobProduction == null)
                    continue;

                var nbProducers = store.state.jobs[jobId as Job].quantity;
                event.produced[consummableId as Consummable] += nbProducers * staticJobProduction.quantity;
            }

            let nbUnfullfiledWorkers = 0; // Nb workers that have not been receiving ressources therefore will be deduced from production
            for (let consummableId in staticJob.consume) {
                let staticJobConsumption: IStaticJobProduction | null = staticJob.consume[consummableId as Consummable];
                if (staticJobConsumption == null)
                    continue;

                var nbConsummer = store.state.jobs[jobId as Job].quantity;
                if (store.state.consummable[consummableId as Consummable].quantity >= nbConsummer * staticJobConsumption.quantity) {
                    event.produced[consummableId as Consummable] -= nbConsummer * staticJobConsumption.quantity;
                } else {
                    // Do not produce if needs not fulfilled!
                    const whatCanBeconsummed = store.state.consummable[consummableId as Consummable].quantity;
                    let nbUnfullfiledWorkersOnConsummable = Math.floor((nbConsummer - store.state.consummable[consummableId as Consummable].quantity) / staticJobConsumption.quantity);
                    nbUnfullfiledWorkers = Math.max(nbUnfullfiledWorkers, nbUnfullfiledWorkersOnConsummable);

                    event.produced[consummableId as Consummable] -= whatCanBeconsummed;
                }
            }


            // Remove part of production based on number of workers with non-fullfiled needs
            if (nbUnfullfiledWorkers > 0) {
                console.warn(`${nbUnfullfiledWorkers} ${jobId} have not seen their needs fullfiled, they will not produce any ressource`);
                for (let consummableId in staticJob.produce) {
                    let staticJobProduction: IStaticJobProduction | null = staticJob.produce[consummableId as Consummable];
                    if (staticJobProduction == null)
                        continue;

                    event.produced[consummableId as Consummable] -= nbUnfullfiledWorkers * staticJobProduction.quantity;
                }
            }

            store.commit('IncrementConsummables', event);
            EventBus.$emit('job-production', event);
        }

        // After operation checks (storage, ...)
        for (let consummableId in StaticConsummableInfo) {
            let staticConsummable: IStaticConsummable = StaticConsummableInfo[consummableId as Consummable]; //TODO: fix typeing weirdlness
            // See if storage fits
            if (staticConsummable.storage && staticConsummable.storage.capacity * store.state.storage[staticConsummable.storage.name].quantity < store.state.consummable[consummableId as Consummable].quantity) {
                let quantityToRemove = Math.floor(this.LackOfStorageFactor *
                    (store.state.consummable[consummableId as Consummable].quantity - store.state.storage[staticConsummable.storage.name].quantity * staticConsummable.storage.capacity));
                store.commit('IncrementConsummable', { name: consummableId, value: -quantityToRemove });
                console.warn(`${quantityToRemove} ${consummableId} were thrown away due to lack of storage`);
            }
        }

    }, this.TickInterval);

    function DoWithProba(proba: number, f: () => void) {
        if (Math.random() <= proba) {
            f();
        }
    }
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

.inventory-item {
  margin-top: 60px;
  width: 300px;
}
.job-item {
  margin-top: 60px;
  width: 300px;
}
.map-item {
  
}
</style>
