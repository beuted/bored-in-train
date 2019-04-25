<template>
    <div>
        <h2>Jobs</h2>
            <ul>
                <li>
                    <span>Population: {{ population.quantity }} / {{ popStorage }}</span>
                    <span v-if="debugMode">{{ jobs }}</span>
                </li>

                <li>
                    <span>Unemployed: {{ unemployed }}</span>
                </li>
                <li>
                    <span>
                        <JobTooltip v-once jobName="berryGatherer"><ParticleEmitter jobName="berryGatherer">Berry Gatherer:</ParticleEmitter></JobTooltip> {{ jobs.berryGatherer.quantity }} / ∞
                        <button v-bind:disabled="!canAddJob(1, 'berryGatherer')" v-on:click="addJob(1, 'berryGatherer')">Add</button>
                        <button v-bind:disabled="!canRemoveJob(1, 'berryGatherer')" v-on:click="removeJob(1, 'berryGatherer')">Remove</button>
                    </span>
                </li>
                <li>
                    <span>
                        <JobTooltip v-once jobName="woodGatherer"><ParticleEmitter jobName="woodGatherer">Wood Gatherer:</ParticleEmitter></JobTooltip> {{ jobs.woodGatherer.quantity }} / ∞
                        <button v-bind:disabled="!canAddJob(1, 'woodGatherer')" v-on:click="addJob(1, 'woodGatherer')">Add</button>
                        <button v-bind:disabled="!canRemoveJob(1, 'woodGatherer')"  v-on:click="removeJob(1, 'woodGatherer')">Remove</button>
                    </span>
                </li>
                <li>
                    <span>
                        <JobTooltip v-once jobName="farmer"><ParticleEmitter jobName="farmer">Farmer:</ParticleEmitter></JobTooltip> {{ jobs.farmer.quantity }} / {{ getMaxStorage('farmer') }}
                        <button v-bind:disabled="!canAddJob(1, 'farmer')" v-on:click="addJob(1, 'farmer')">Add</button>
                        <button v-bind:disabled="!canRemoveJob(1, 'farmer')" v-on:click="removeJob(1, 'farmer')">Remove</button>
                    </span>
                </li>
                <li>
                    <span>
                        <JobTooltip v-once jobName="stoneGatherer"><ParticleEmitter jobName="stoneGatherer">Stone Gatherer:</ParticleEmitter></JobTooltip> {{ jobs.stoneGatherer.quantity }} / ∞
                        <button v-bind:disabled="!canAddJob(1, 'stoneGatherer')" v-on:click="addJob(1, 'stoneGatherer')">Add</button>
                        <button v-bind:disabled="!canRemoveJob(1, 'stoneGatherer')"  v-on:click="removeJob(1, 'stoneGatherer')">Remove</button>
                    </span>
                </li>
            </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { StaticJobInfo, IStorage } from '@/services/GameEngine';
import { Job } from '@/models/Job';
import { Storage } from '@/models/Storage';

import JobTooltip from '@/components/JobTooltip.vue';
import ParticleEmitter from '@/components/ParticleEmitter.vue';


@Component({
  components: {
      JobTooltip,
      ParticleEmitter
  },
})
export default class Jobs extends IdleGameVue {
    public get population() {
        return this.$store.state.consummable.population;
    }

    public get jobs() {
        return this.$store.state.jobs;
    }

    public get unemployed() {
        let totalWithJob = 0;
        for (let key in this.$store.state.jobs) {
            if (key == 'default')
                continue;

            totalWithJob += this.$store.state.jobs[key as Job].quantity;
        };
        return this.$store.state.consummable.population.quantity - totalWithJob;
    }

    public get debugMode() {
        return this.$store.state.debugMode;
    }

    public get popStorage() {
        return this.$store.getters.getRessourceStorage('population');
    }

    public addJob(quantity: number, jobName: string) {
        if (this.canAddJob(quantity, jobName))
            this.$store.commit('AddJob', { jobName: jobName, quantity: quantity });
    }

    public removeJob(quantity: number, jobName: string) {
        if (this.canRemoveJob(quantity, jobName))
            this.$store.commit('AddJob', { jobName: jobName, quantity: -quantity });
    }

    public getMaxStorage(jobName: Job): number {
        var storageNeeded = StaticJobInfo[jobName].storage;
        if (!storageNeeded)
            return -1;
        return this.$store.state.storage[storageNeeded.name as Storage].quantity * storageNeeded.capacity;
    }

    public canAddJob(quantity: number, jobName: string): boolean {
        if (this.unemployed <= 0)
            return false

        var maxStorage = this.getMaxStorage(jobName as Job);

        if (maxStorage != -1 && maxStorage <= this.$store.state.jobs[jobName as Job].quantity)
            return false;

        return true;
    }

    public canRemoveJob(quantity: number, jobName: string) {
         return this.$store.state.jobs[jobName as Job].quantity >= quantity;
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
