<template>
    <div>
        <span v-on:click="togglePlay()" class="control">
            <span v-if="!isPlay">▶️</span>
            <span v-if="isPlay">⏸</span>
        </span>
        <span v-on:click="toggleFastForward()" class="control">
            ⏩
        </span>
        <span>speed: x {{ gameSpeed }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { StaticJobInfo, IStorage } from '@/services/GameEngine';
import { Job } from '@/models/Job';
import { Storage } from '@/models/Storage';



@Component({
  components: {
  },
})
export default class Controls extends IdleGameVue {
    public get isPlay() {
        return this.$store.state.controls.play;
    }

    public get gameSpeed() {
        return this.$store.state.controls.speed;
    }

    public togglePlay() {
        this.$store.commit('TogglePlay');
    }

    public toggleFastForward() {
        this.$store.commit('ToggleFastForward');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .control {
        cursor: pointer;
    }
</style>
