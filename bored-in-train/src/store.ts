import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

type consummable = 'population' | 'berries' | 'sticks';

export default new Vuex.Store({
  state: {
    population: {
      quantity: 100,
      remainingTime: 1000,
      consuming: {
        berries: {
          remainingTime: 4000,
        },
      },
    },
    berries: {
      quantity: 0,
      remainingTime: 2000,
      consuming: undefined,
    },
    sticks: {
      quantity: 0,
      remainingTime: 1000,
      consuming: undefined,
    },
  },
  mutations: {
    // Increment the value of a consummable from 'value'
    Increment(state, obj: { name: consummable, value: number }) {
      state[obj.name].quantity += obj.value;
    },
    // Decremente the remaining time before a spawn of a consummable from 1 tick (1000 ms)
    Tick(state, obj: consummable) {
      state[obj].remainingTime -= 1000;
    },
    // Reset the interval of spawing of a consummable
    ResetInterval(state, obj: { name: consummable, interval: number }) {
      state[obj.name].remainingTime = obj.interval;
    },
    // Decremente the remaining time before a consumption of a consummable from 1 tick (1000 ms)
    TickConsuming(state, obj: { name: consummable, consuming: consummable }) {
      if (state[obj.name].consuming === undefined) { return; }
      const a = state[obj.name].consuming; // ugly hack todo: fix types
      (<any> a)[obj.consuming].remainingTime -= 1000;
    },
    // Reset the interval of consumption of a consummable
    ResetIntervalConsuming(state, obj: { name: consummable, consuming: consummable, interval: number }) {
      if (state[obj.name].consuming === undefined) { return; }
      const a = state[obj.name].consuming; // ugly hack todo: fix types
      (<any> a)[obj.consuming].remainingTime = obj.interval;
    },
  },
  actions: {

  },
});
