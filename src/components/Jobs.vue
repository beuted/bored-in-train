<template>
    <div>
        <h2>Jobs</h2>
            <ul>
                <li>
                    <span>Population: {{ population.quantity }}</span>
                    <span v-if="debugMode">{{ population }}</span>
                </li>

                <li>
                    <span>Unemployed: {{ unemployed }}</span>
                </li>
                <li>
                    <span>
                        Gatherer: {{ population.jobs.gatherer }}
                        <button :disabled="unemployed <= 0" v-on:click="addGatherer(1)">Add</button>
                        <button :disabled="population.jobs.gatherer <= 0" v-on:click="addGatherer(-1)">Remove</button>
                    </span>
                </li>
                <li>
                    <span>
                        Farmer: {{ population.jobs.farmer }}
                        <button :disabled="unemployed <= 0" v-on:click="addFarmer(1)">Add</button>
                        <button :disabled="population.jobs.farmer <= 0" v-on:click="addFarmer(-1)">Remove</button>
                    </span>
                </li>
            </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Jobs extends Vue {
    public get population() {
        return this.$store.state.population;
    }

    public get unemployed() {
        let totalWithJob = 0;
        Object.keys(this.$store.state.population.jobs).forEach((key) => {
            totalWithJob += this.$store.state.population.jobs[key];
        });
        return this.$store.state.population.quantity - totalWithJob;
    }

    public get debugMode() {
        return this.$store.state.debugMode;
    }

    public addGatherer(quantity: number) {
        this.$store.commit('AddJob', { jobName: 'gatherer', quantity: quantity });
    }

    public addFarmer(quantity: number) {
        this.$store.commit('AddJob', { jobName: 'farmer', quantity: quantity });
    }

    public canAddJob() {
        this.unemployed > 0;
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
</style>
