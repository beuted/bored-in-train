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
import Jobs from '@/components/Jobs.vue'; // @ is an alias to /src
import Inventory from '@/components/Inventory.vue';
import Storage from '@/components/Storage.vue';
import Map from '@/components/Map.vue';
import { StaticConsummableInfo, IStaticConsummable, IConsuming } from '@/store';

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
        // First the creation of ressources
        for (let key in StaticConsummableInfo) {
            let solidGood: IStaticConsummable = (<any>StaticConsummableInfo)[key]; //TODO: fix typeing weirdlness

            if (this.$store.state[solidGood.name].remainingTime <= 0) {
                this.$store.commit('ResetInterval', { name: solidGood.name, interval: solidGood.interval });
                DoWithProba(solidGood.probability, () => {
                    // If no producer is defined, resource will be incremented 1 by 1
                    var nbProducers = solidGood.job ? this.$store.state.population.jobs[solidGood.job] : 1;

                    this.$store.commit('Increment', { name: solidGood.name, value: nbProducers });
                });
            } else {
                this.$store.commit('Tick', solidGood.name);
            }
        }

        // Then the consumming of ressources
        for (let key in StaticConsummableInfo) {
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
        }

        // After operation checks
        for (let key in StaticConsummableInfo) {
            let solidGood: IStaticConsummable = (<any>StaticConsummableInfo)[key]; //TODO: fix typeing weirdlness
            // See if storage fits
            if (solidGood.storage && this.$store.state[solidGood.storage.name].quantity * solidGood.storage.capacity < this.$store.state[solidGood.name].quantity) {
                let quantityToRemove = Math.floor(this.LackOfStorageFactor * (this.$store.state[solidGood.name].quantity - this.$store.state[solidGood.storage.name].quantity * solidGood.storage.capacity));
                this.$store.commit('Increment', { name: solidGood.name, value: -quantityToRemove });
                console.warn(`${quantityToRemove} ${solidGood.name} were thrown away due to lack of storage`);
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
