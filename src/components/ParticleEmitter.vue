<template>
    <div class="particle-box"><div> <slot></slot> </div>
        <span class="particle particle-positive">
            <transition name="bounce">
                <div v-if="showFoodPos">🍗</div>
            </transition>
            <transition name="bounce">
                <div v-if="showStickPos">🌲</div>
            </transition>
        </span>
        <span class="particle particle-negative">
            <transition name="bounce">
                <div v-if="showFoodNeg">🍗</div>
            </transition>
            <transition name="bounce">
                <div v-if="showStickNeg">🌲</div>
            </transition>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { StaticJobInfo } from '@/services/GameEngine';
import { EventBus, IJobProductionEvent } from '@/EventBus';

@Component({
  components: {
  },
})
export default class ParticleEmitter extends IdleGameVue {
    @Prop() private jobName!: Job;
    private showFoodPos: boolean = false;
    private showFoodNeg: boolean = false;
    private showStickPos: boolean = false;
    private showStickNeg: boolean = false;

    public constructor() {
        super();
        EventBus.$on('job-production', (event: IJobProductionEvent) => {
            if (event.job == this.jobName)
                this.emitParticles(event)
        });
    }

    private emitParticles(event: IJobProductionEvent) {
        if (event.produced.food > 0) {
            this.showFoodPos = true;
            setTimeout(() => { this.showFoodPos = false; }, 800);
        } else if (event.produced.food < 0) {
            this.showFoodNeg = true;
            setTimeout(() => { this.showFoodNeg = false; }, 800);
        }

        if (event.produced.sticks > 0) {
            this.showStickPos = true;
            setTimeout(() => { this.showStickPos = false; }, 800);
        } else if (event.produced.sticks < 0) {
            this.showStickNeg = true;
            setTimeout(() => { this.showStickNeg = false; }, 800);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/* particle container */
.particle-box {
  position: relative;
  display: inline-block;
}

/* particle */
.particle-box .particle {
  width: 120px;
  bottom: 100%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
  background-color: transparent;
  text-align: center;
  padding: 5px 0;
  

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.particle-box .particle-positive {
    text-shadow: 0 0 5px green;
    left: 50%+20px;
}

.particle-box .particle-negative {
    text-shadow: 0 0 5px red;
    left: 50%-30px;
}

/* transitions */
.bounce-enter-active {
    animation: bounce-in 0.8s;
}

.bounce-leave-active {
    animation: bounce-out 0.1s; //needed to avoid glitch
}

@keyframes bounce-in
{
    0% {
        opacity: 0;
        transform:translateY(20px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform:translateY(-10px);
    }
}

@keyframes bounce-out
{
    0% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}
</style>
