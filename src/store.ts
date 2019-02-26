import Vue from 'vue';
import Vuex from 'vuex';

import { Building } from '@/models/Building';

Vue.use(Vuex);

enum consummable {
  population= 'population',
  food = 'food',
  sticks = 'sticks'
}

enum job {
  berryGatherer = 'berryGatherer',
  woodGatherer = 'woodGatherer'
}
enum storage {
  houses = 'houses',
  barns = 'barns'
}

export type IStaticConsummableInfo = {[id in consummable]: IStaticConsummable}
export type IStaticStorageInfo = {[id in storage]: IStaticStorage}

export interface IStaticConsummable {
  name: string;
  interval: number;
  probability: number;
  consuming: {[id in consummable]?: IConsuming}
  storage: IStorage | undefined;
  job: job | undefined;
}

export interface IStaticStorage {
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

export const StaticStorageInfo: IStaticStorageInfo = {
  houses: {
  },
  barns: {
  }
}

export const StaticConsummableInfo: IStaticConsummableInfo = {
  population: {
    name: consummable.population,
    consuming: {
      food: {
        name: consummable.food,
        consomation: 1,
        interval: 8000,
        probability: 1,
      },
    },
    storage: {
      name: storage.houses,
      capacity: 10
    },
    interval: 1000,
    probability: 0.1,
    job: undefined
  },
  food: {
    interval: 2000,
    name: consummable.food,
    consuming: {},
    storage: {
      name: storage.barns,
      capacity: 10
    },
    probability: 0.7,
    job: job.berryGatherer
  },
  sticks: {
    interval: 1000,
    name: consummable.sticks,
    consuming: {},
    probability: 0.2,
    job: job.woodGatherer,
    storage: undefined,
  },
};

export default new Vuex.Store({
  state: {
    debugMode: false,
    map: [[0]],
    population: {
      quantity: 6,
      remainingTime: 1000,
      consuming: {
        food: {
          remainingTime: 8000,
        },
      },
      jobs: {
        woodGatherer: 0,
        berryGatherer: 1,
      }
    },
    food: {
      quantity: 5,
      remainingTime: 2000,
      consuming: undefined,
    },
    sticks: {
      quantity: 100,
      remainingTime: 1000,
      consuming: undefined,
    },
    houses: {
      quantity: 1,
      remainingTime: 1000,
      consuming: undefined,
    },
    barns: {
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

      // Special case of shrinking population to handle missing jobs
      if (obj.value < 0 && obj.name == consummable.population) {
        let totalWithJob = 0;
        Object.keys(state.population.jobs).forEach((key) => {
            totalWithJob += (state.population.jobs as any)[key];
        });

        if (state[obj.name].quantity < totalWithJob) {
          console.log('Part of your population died you have to remove some jobs');
        }
      }
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
      state.map = new Array(size).fill(0).map(x => Array(size).fill(0));
      var center = Math.floor(size/2);
      state.map[center][center] = Building.House;
      state.map[center][center+1] = Building.Barn;
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state, obj: { x: number, y: number, type: Building }) {
      console.debug(`Changing tile ${obj.x}, ${obj.y} to ${obj.type}`);
      (state.map[obj.x])[obj.y] = obj.type;

      if (obj.type == Building.House)
        state.houses.quantity++;

      if (obj.type == Building.Barn)
        state.barns.quantity++;
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
        var storage = StaticConsummableInfo[id].storage;
        if (storage=== undefined)
          return -1;

        return state[storage.name].quantity * storage.capacity;
      }
    }
  }
});
