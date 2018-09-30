import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

type consummable = 'population' | 'berries' | 'sticks';

export default new Vuex.Store({
  state: {
    population: {
      quantity: 1,
      remainingTime: 1000,
      consuming: {
        berries: {
          remainingTime: 10000,
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
    Increment(state, obj: { name: consummable, value: number }) {
      state[obj.name].quantity += obj.value;
    },
    Tick(state, obj: consummable) {
      state[obj].remainingTime -= 1000;
    },
    ResetInterval(state, obj: { name: consummable, interval: number }) {
      state[obj.name].remainingTime = obj.interval;
    },
    TickConsuming(state, obj: { name: consummable, consuming: consummable }) {
      if (state[obj.name].consuming === undefined) { return; }
      const a = state[obj.name].consuming; // ugly hack todo: fix types
      (<any> a)[obj.consuming].remainingTime -= 1000;
    },
    ResetIntervalConsuming(state, obj: { name: consummable, consuming: consummable, interval: number }) {
      if (state[obj.name].consuming === undefined) { return; }
      const a = state[obj.name].consuming; // ugly hack todo: fix types
      (<any> a)[obj.consuming].remainingTime = obj.interval;
    },
  },
  actions: {

  },
});
