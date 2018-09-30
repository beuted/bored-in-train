<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <SolidGoods />
    <Inventory />

    <div class="build">
        <h2>Build</h2>
        <ul>
            <li></li>
            <li></li>
        </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SolidGoods from '@/components/SolidGoods.vue'; // @ is an alias to /src
import Inventory from '@/components/Inventory.vue';

@Component({
  components: {
    SolidGoods,
    Inventory,
  },
})
export default class Game extends Vue {
  @Prop() private msg!: string;

  private readonly SolidGoods = {
    berries: {
        interval: 2000,
        name: 'berries',
        consuming: {},
        probability: 1,
    },
    sticks: {
        interval: 1000,
        name: 'sticks',
        consuming: {},
        probability: 0.2,
    },
    population: {
        name: 'population',
        consuming: {
            berries: {
                name: 'berries',
                consomation: 1,
                interval: 10000,
                probability: 1,
            },
        },
        interval: 1000,
        probability: 0.1,
    },
  }

  private readonly TickInterval = 1000;

  public mounted() {
    console.log("I'm bored in a train");

    setInterval (() => {
        // First the creation of ressources
        for (let key in this.SolidGoods) {
            let solidGood = this.SolidGoods[key];
            if (this.$store.state[solidGood.name].remainingTime <= 0) {
                this.$store.commit('ResetInterval', { name: solidGood.name, interval: solidGood.interval });
                if (Math.random() <= solidGood.probability) {
                    this.$store.commit('Increment', { name: solidGood.name, value: 1 });
                }
            } else {
                this.$store.commit('Tick', solidGood.name);
            }
        }

        // Then the consumming of ressources
        for (let key in this.SolidGoods) {
            let solidGood = this.SolidGoods[key];

            for (let consumedKey in solidGood.consuming) {
                let consumed = solidGood.consuming[consumedKey];

                if (this.$store.state[solidGood.name].consuming[consumed.name].remainingTime <= 0) {
                    this.$store.commit('ResetIntervalConsuming', { name: solidGood.name, consuming: consumed.name, interval: consumed.interval });
                    if (Math.random() <= consumed.probability) {
                        if (this.$store.state[consumed.name].quantity >= consumed.consomation) {
                            this.$store.commit('Increment', { name: consumed.name, value: -consumed.consomation * this.$store.state[solidGood.name].quantity });
                        } else {
                            // If there is not enough consumable to sustain the good
                            // TODO: put ressourc ein too fex quantity for this round to 0
                            this.$store.commit('Increment', { name: solidGood.name, value: -1 });
                        }
                    }
                } else {
                    this.$store.commit('TickConsuming', { name: solidGood.name, consuming: consumed.name });
                }
            }
        }

    }, this.TickInterval);
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
