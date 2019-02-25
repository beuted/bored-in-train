import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

type consummable = 'population' | 'berries' | 'sticks';
type job = 'gatherer' | 'farmer';
type storage = 'houses';

export interface ISolidGoods { //TODO do better, use type consummable
  population: ISolidGood;
  berries: ISolidGood;
  sticks: ISolidGood;
}

export interface ISolidGood {
  name: string;
  interval: number;
  probability: number;
  consuming: { //TODO do better, use type consummable
    population?: IConsuming,
    berries?: IConsuming,
    sticks?: IConsuming
  };
  storage: IStorage | undefined;
  job: job | undefined
}

export interface IConsuming {
  name: consummable;
  consomation: number;
  interval: number;
  probability: number;
}

export interface IStorage {
  name: storage;
  capacity: number;
}

export const SolidGoods: ISolidGoods = {
  population: {
    name: 'population',
    consuming: {
      berries: {
        name: 'berries',
        consomation: 1,
        interval: 8000,
        probability: 1,
      },
    },
    storage: {
      name: 'houses',
      capacity: 10
    },
    interval: 1000,
    probability: 0.1,
    job: undefined
  },
  berries: {
    interval: 2000,
    name: 'berries',
    consuming: {},
    probability: 1,
    job: 'gatherer',
    storage: undefined,
  },
  sticks: {
    interval: 1000,
    name: 'sticks',
    consuming: {},
    probability: 0.2,
    job: 'gatherer',
    storage: undefined,
  },
};

export default new Vuex.Store({
  state: {
    debugMode: false,
    map: [[0]],
    population: {
      quantity: 1,
      remainingTime: 1000,
      consuming: {
        berries: {
          remainingTime: 8000,
        },
      },
      jobs: {
        gatherer: 1,
        farmer: 0
      }
    },
    berries: {
      quantity: 5,
      remainingTime: 2000,
      consuming: undefined,
    },
    sticks: {
      quantity: 0,
      remainingTime: 1000,
      consuming: undefined,
    },
    houses: {
      quantity: 1,
      remainingTime: 1000,
      consuming: undefined,
    },
  },
  mutations: {
    // Increment the value of a consummable from 'value'
    ToggleDebugMode(state) {
      state.debugMode = !state.debugMode
    },
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
    // Init the map with 1 and one house
    InitMap(state, size: number) {
      state.map = new Array(size).fill(1).map(x => Array(size).fill(1));
      var center = Math.floor(size/2);
      state.map[center][center] = 2;
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state, obj: { x: number, y: number, type: number }) {
      console.debug(`Changing tile ${obj.x}, ${obj.y} to  ${obj.type}`);
      (state.map[obj.x])[obj.y] = obj.type;

      if (obj.type == 2)
        state.houses.quantity++;
    },
    //Add
    AddJob(state, obj: { jobName: job, quantity: number }) {
      console.debug(`AddJob tile ${obj.jobName}, ${obj.quantity}`);
      state.population.jobs[obj.jobName] += obj.quantity;
    },
  },
  actions: {

  },
  getters: {
    getRessourceStorage(state): (id: consummable) => number {
      return (id: consummable) => {
        var storage = SolidGoods[id].storage;
        if (storage=== undefined)
          return -1;

        return state[storage.name].quantity * storage.capacity;
      }
    }
  }
});
