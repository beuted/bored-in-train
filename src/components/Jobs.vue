<template>
    <div>
        <h2>Jobs</h2>
        <ul>
            <li>
                <span>Unemployed: {{ unemployed }}</span>
            </li>
            <li v-for="jobName in jobs" v-bind:key="jobName">
                <span class="jobs">
                    <div>
                        <JobTooltip :jobName="jobName"><ParticleEmitter :jobName="jobName">{{ getJobDisplayName(jobName) }}:</ParticleEmitter></JobTooltip> {{ getJobQuantity(jobName) }} / {{ getJobMaxStorage(jobName) }}
                    </div>
                    <div>
                        <button class="add-button" v-bind:disabled="!canRemoveJob(1, jobName)" v-on:click="removeJob(1, jobName)">-</button>
                        <button class="add-button" v-bind:disabled="!canAddJob(1, jobName)" v-on:click="addJob(1, jobName)">+</button>
                    </div>
                </span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { StaticJobInfo } from '@/services/GameEngine';
import { Job } from '@/models/Job';
import { Building } from '@/models/Building';

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

    public getJobQuantity(jobName: Job) {
        return this.$store.state.jobs[jobName].quantity;
    }

    public getJobDisplayName(jobName: Job) {
        return StaticJobInfo[jobName].name;
    }

    public getJobMaxStorage(jobName: Job): string {
        var maxStorage = this.computeMaxStorage(jobName)
        return maxStorage != -1 ? String(maxStorage) : '∞'
    }

    public get jobs() {
        return Object.keys(this.$store.state.jobs).filter(x => x !== 'default');
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

    public canAddJob(quantity: number, jobName: string): boolean {
        if (this.unemployed < 1)
            return false

        var maxStorage = this.computeMaxStorage(jobName as Job);

        if (maxStorage != -1 && maxStorage <= this.$store.state.jobs[jobName as Job].quantity)
            return false;

        return true;
    }

    public canRemoveJob(quantity: number, jobName: string) {
         return this.$store.state.jobs[jobName as Job].quantity >= quantity;
    }

    private computeMaxStorage(jobName: Job): number {
        var storageNeeded = StaticJobInfo[jobName].storage;
        if (!storageNeeded)
            return -1;
        return this.$store.state.map.buildings[storageNeeded.name as Building].quantity * storageNeeded.capacity;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
.jobs {
    display: flex;
    justify-content: space-between;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px;
}
.add-button {
    border: none;
    border-radius: 10px;
    width: 20px;
    height: 20px;
    text-align: center;
    margin-left: 5px;
    background-color: #2c3e50;
    color: white;
    cursor: pointer;
}
.add-button:hover {
    opacity: 0.9;
}
.add-button:disabled {
    opacity: 0.3;
    cursor: default;
}
</style>
