<template>
    <div class="particle-box"><div> <slot></slot> </div>
        <span class="particle particle-positive">
            <transition name="bounce">
                <div v-if="shows['food'].positive">🍗</div>
            </transition>
            <transition name="bounce">
                <div v-if="shows['wood'].positive">🌲</div>
            </transition>
            <transition name="bounce">
                <div v-if="shows['stones'].positive">⛏️</div>
            </transition>
            <transition name="bounce">
                <div v-if="shows['coals'].positive">💎</div>
            </transition>
        </span>
        <span class="particle particle-negative">
            <transition name="unbounce">
                <div v-if="shows['food'].negative">🍗</div>
            </transition>
            <transition name="unbounce">
                <div v-if="shows['wood'].negative">🌲</div>
            </transition>
            <transition name="unbounce">
                <div v-if="shows['stones'].negative">⛏️</div>
            </transition>
            <transition name="unbounce">
                <div v-if="shows['coals'].negative">💎</div>
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
import { Consummable } from '@/models/Consummable';

@Component({
  components: {
  },
})
export default class ParticleEmitter extends IdleGameVue {
    @Prop() private jobName!: Job;

    private shows: { [id in Consummable]: { positive: boolean, negative: boolean } } = {
        population: { positive: false, negative: false },
        food: { positive: false, negative: false },
        wood: { positive: false, negative: false },
        stones: { positive: false, negative: false },
        coals: { positive: false, negative: false },
    }

    public constructor() {
        super();
        EventBus.$on('job-production', (event: IJobProductionEvent) => {
            if (event.job == this.jobName)
                this.emitParticles(event)
        });
    }

    private emitParticles(event: IJobProductionEvent) {
        for (let consummable in Consummable) {
            if (event.produced[consummable as Consummable] > 0) {
                this.shows[consummable as Consummable].positive = true;
                setTimeout(() => { this.shows[consummable as Consummable].positive = false; }, 800);
            } else if (event.produced[consummable as Consummable] < 0) {
                this.shows[consummable as Consummable].negative = true;
                setTimeout(() => { this.shows[consummable as Consummable].negative = false; }, 800);
            }
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

.unbounce-enter-active {
    animation: unbounce-in 0.8s;
}

.unbounce-leave-active {
    animation: unbounce-out 0.1s; //needed to avoid glitch
}

@keyframes unbounce-in
{
    0% {
        opacity: 0;
        transform:translateY(-10px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform:translateY(20px);
    }
}

@keyframes unbounce-out
{
    0% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}
</style>
