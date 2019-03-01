<template>
  <div>
    <h1>{{ msg }} <button v-on:click="toggleDebug()">Debug</button></h1>

    <Jobs />
    <Inventory />
    <Storage />
    <Map />
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
import { IState } from '@/store';

@Component({
  components: {
    Jobs,
    Inventory,
    Storage,
    Map,
  },
})
export default class Game extends Vue {
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
            let staticJob: IStaticJob = (<any>StaticJobInfo)[jobId]; //TODO: fix typeing weirdlness

            if ((store.state.jobs as any)[jobId].produceRemainingTime <= 0) {
                store.commit('ResetProduceInterval', { job: jobId });

                for (let consummableId in staticJob.produce) {
                    let staticJobConsumption: IStaticJobProduction | null = (staticJob.produce as any)[consummableId];
                    if (staticJobConsumption == null)
                        continue;
                
                    var nbProducers = (store.state.jobs as any)[jobId].quantity;
                    store.commit('IncrementConsummable', { name: consummableId, value: nbProducers });
                }
            } else {
                store.commit('TickProduce', { job: jobId });
            }
        }

        // Then the consumming of ressources
        for (let jobId in StaticJobInfo) {
            let staticJob: IStaticJob = (<any>StaticJobInfo)[jobId]; //TODO: fix typeing weirdlness

            if ((store.state.jobs as any)[jobId].consumeRemainingTime <= 0) {
                store.commit('ResetConsummeInterval', { job: jobId });

                for (let consummableId in staticJob.consume) {
                    let staticJobConsumption: IStaticJobProduction | null = (staticJob.consume as any)[consummableId];
                    if (staticJobConsumption == null)
                        continue;

                    var nbConsummer = (store.state.jobs as any)[jobId].quantity;
                    if ((store.state.consummable as any)[consummableId].quantity >= nbConsummer * staticJobConsumption.quantity) {
                        store.commit('IncrementConsummable', { name: consummableId, value: -nbConsummer * staticJobConsumption.quantity });
                    } else {
                        //TODO: do not produce if needs not fulfilled !!!!
                    }

                }
            } else {
                store.commit('TickConsumme', { job: jobId });
            }
        }

        // Previous code, remove when equivalent reached
        /*for (let key in StaticConsummableInfo) {
            let solidGood: IStaticConsummable = (<any>StaticConsummableInfo)[key]; //TODO: fix typeing weirdlness

            for (let consumedKey in solidGood.consuming) {
                let consumed: IConsuming = (<any>solidGood.consuming)[consumedKey]; //TODO: fix typeing weirdlness

                if (this.$store.state[solidGood.name].consuming[consumed.name].remainingTime <= 0) {
                    this.$store.commit('ResetIntervalConsuming', { name: solidGood.name, consuming: consumed.name, interval: consumed.interval });
                    DoWithProba(consumed.probability, () => {
                        if (this.$store.state[consumed.name].quantity >= consumed.consomation * this.$store.state[solidGood.name].quantity) {
                            this.$store.commit('Increment', { name: consumed.name, value: -consumed.consomation * this.$store.state[solidGood.name].quantity });
                        } else {
                            // Decrease the starving good from the starving part
                            let nbStarvingGoods = Math.floor(this.StarvationFactor * (this.$store.state[solidGood.name].quantity - (this.$store.state[consumed.name].quantity / consumed.consomation)));
                            this.$store.commit('Increment', { name: solidGood.name, value: -nbStarvingGoods });
                            console.warn(`${nbStarvingGoods} ${solidGood.name} vanished because they could not find ${consumed.name} `);

                            // Consumme what can be consummed
                            this.$store.commit('Increment', { name: consumed.name, value: -this.$store.state[consumed.name].quantity });
                        }
                    });
                } else {
                    this.$store.commit('TickConsuming', { name: solidGood.name, consuming: consumed.name });
                }
            }
        }*/

        // After operation checks
        for (let consummableId in StaticConsummableInfo) {
            let staticConsummable: IStaticConsummable = (<any>StaticConsummableInfo)[consummableId]; //TODO: fix typeing weirdlness
            // See if storage fits
            if (staticConsummable.storage && staticConsummable.storage.capacity * (store.state.storage as any)[staticConsummable.storage.name].quantity < (store.state.consummable as any)[consummableId].quantity) {
                let quantityToRemove = Math.floor(this.LackOfStorageFactor *
                    ((store.state.consummable as any)[consummableId].quantity - store.state.storage[staticConsummable.storage.name].quantity * staticConsummable.storage.capacity));
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
</style>
