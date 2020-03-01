<template>
    <div class="particle-box"><div> <slot></slot> </div>
        <span class="particle particle-positive">
            <transition name="bounce " v-for="(value, key) in consumables" :key="key">
                <div v-if="shows[value].positive"><img v-bind:src="getParticleEmoji(value)"/></div>
            </transition>
        </span>
        <span class="particle particle-negative">
            <transition name="unbounce" v-for="(value, key) in consumables" :key="key">
                <div v-if="shows[value].negative"><img v-bind:src="getParticleEmoji(value)"/></div>
            </transition>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';
import { StaticConsumableInfo } from '@/services/GameEngine';
import { EventBus, IProductionEvent } from '@/EventBus';
import { Consumable } from '@/models/Consumable';

@Component({
  components: {
  },
})
export default class ParticleEmitter extends IdleGameVue {
    @Prop() private consumable!: Consumable;

    private shows: { [id in Consumable]: { positive: boolean, negative: boolean } } = <any>{};

    public constructor() {
        super();
        EventBus.$on('consumable-production', (event: { [id in Consumable]: number }) => {
            //TODO: do better position should be set by the js
            //if (event[this.consumable])
                //this.emitParticles(event[this.consumable], this.consumable)
        });

        // Init the show array
        for (let consumable in Consumable) {
            this.shows[consumable as Consumable] = { positive: false, negative: false };
        }
    }

    public get consumables() {
        return Consumable;
    }

    public getParticleEmoji(consumable: Consumable) {
        return StaticConsumableInfo[consumable].icon;
    }

    private emitParticles(nbConsumable: number, consumable: Consumable) {
        if (nbConsumable > 0) {
            this.shows[consumable as Consumable].positive = true;
            setTimeout(() => { this.shows[consumable as Consumable].positive = false; }, 800);
        } else if (nbConsumable < 0) {
            this.shows[consumable as Consumable].negative = true;
            setTimeout(() => { this.shows[consumable as Consumable].negative = false; }, 800);
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
        transform: translateY(-10px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(20px);
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
