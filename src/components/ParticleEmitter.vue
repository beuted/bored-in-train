<template>
    <div class="particle-box"><div> <slot></slot> </div>
        <span class="particle">
            <transition name="bounce">
                <div v-if="show">🚀</div>
            </transition>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';
import { Job } from '@/models/Job';
import { StaticJobInfo } from '@/services/GameEngine';
import { EventBus, JobProductionEvent } from '@/EventBus';

@Component({
  components: {
  },
})
export default class ParticleEmitter extends IdleGameVue {
    @Prop() private jobName!: Job;
    private show: boolean = false;

    public constructor() {
        super();
        EventBus.$on('job-production', (event: JobProductionEvent) => {
            if (event.jobName == this.jobName)
                this.emitParticle(event)
        });
    }

    public emitParticle(event: JobProductionEvent) {
        this.show = !this.show;
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
  left: 50%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
  background-color: transparent;
  text-align: center;
  padding: 5px 0;
  text-shadow: 0 0 5px green;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* transitions */


.bounce-enter-active {
    animation: bounce-in 1.0s;
}

@keyframes bounce-in {
    0% {
        opacity: 0;
        transform:translateY(0px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform:translateY(-20px);
      }
   }
</style>
