<template>
    <div>
        <h2>Jobs</h2>
            <ul>
                <li>
                    <span>Population: {{ population.quantity }} / {{ popStorage }}</span>
                    <span v-if="debugMode">{{ population }}</span>
                </li>

                <li>
                    <span>Unemployed: {{ unemployed }}</span>
                </li>
                <li>
                    <span>
                        Wood Gatherer: {{ population.jobs.woodGatherer }}
                        <button :disabled="unemployed <= 0" v-on:click="addJob(1, 'woodGatherer')">Add</button>
                        <button :disabled="population.jobs.woodGatherer <= 0" v-on:click="addJob(-1, 'woodGatherer')">Remove</button>
                    </span>
                </li>
                <li>
                    <span>
                        Berry Gatherer: {{ population.jobs.berryGatherer }}
                        <button :disabled="unemployed <= 0" v-on:click="addJob(1, 'berryGatherer')">Add</button>
                        <button :disabled="population.jobs.berryGatherer <= 0" v-on:click="addJob(-1, 'berryGatherer')">Remove</button>
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

    public get popStorage() {
        return this.$store.getters.getRessourceStorage('population');
    }

    public addJob(quantity: number, jobName: string) {
        this.$store.commit('AddJob', { jobName: jobName, quantity: quantity });
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
