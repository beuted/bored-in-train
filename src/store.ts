import Vue from 'vue';
import Vuex from 'vuex';

import { Building } from '@/models/Building';
import { MapBuilder } from './services/MapBuilder';
import { Consummable } from './models/Consummable';
import { Storage } from '@/models/Storage';
import { Job } from './models/Job';
import { StaticConsummableInfo, StaticJobInfo } from './services/GameEngine';

Vue.use(Vuex);

export interface IState {
  debugMode: boolean,
  map: { building: number, environment: number }[][],
  consummable: { [id in Consummable]: { quantity: number } },
  storage: { [id in Storage]: { quantity: number } },
  jobs: { [id in Job]: { quantity: number, consumeRemainingTime: number, produceRemainingTime: number } },
}

//TODO: override with something like this
//interface Vue {
//  $store: Store<IState>;
//}

export default new Vuex.Store<IState>({
  state: {
    debugMode: false,
    map: [[{ building: 0, environment: 0 }]],
    consummable: {
      population: {
        quantity: 6,
      },
      food: {
        quantity: 5,
      },
      sticks: {
        quantity: 100,
      },
    },
    storage: {
      villages: {
        quantity: 1,
      },
      barns: {
        quantity: 1,
      },
      farms: {
        quantity: 0,
      },
    },
    jobs: {
      woodGatherer: {
        quantity: 0,
        consumeRemainingTime: 1000,
        produceRemainingTime: 1000,
      },
      berryGatherer: {
        quantity: 1,
        consumeRemainingTime: 1000,
        produceRemainingTime: 1000,
      },
      default: { //Job producing population
        quantity: 1,
        consumeRemainingTime: 1000,
        produceRemainingTime: 1000,
      }
    },
  },
  mutations: {
    // Increment the value of a consummable from 'value'
    ToggleDebugMode(state) {
      state.debugMode = !state.debugMode
    },
    // Increment the value of a consummable from 'value'
    IncrementConsummable(state, obj: { name: Consummable, value: number }) {
      state.consummable[obj.name].quantity += obj.value;

      // Special case of shrinking population to handle missing jobs
      if (obj.value < 0 && obj.name == Consummable.population) {
        let totalWithJob = 0;
        for (let key in state.jobs) {
            totalWithJob += (state.jobs as any)[key].quantity; //FIX ME wassup with the typing issue here ?
        };

        if (state.consummable.population.quantity < totalWithJob) {
          console.warn('You have to remove some jobs'); //TODO
        }
      }
    },
    // Decremente the remaining time before a spawn of a consummable from 1 tick (1000 ms)
    TickConsumme(state, obj: { job: Job} ) {
      state.jobs[obj.job].consumeRemainingTime -= 1000;
      //TODO tick the default job ?
    },
    // Decremente the remaining time before a consumming of a consummable from 1 tick (1000 ms)
    TickProduce(state, obj: { job: Job} ) {
      state.jobs[obj.job].produceRemainingTime -= 1000;
      //TODO tick the default job ?
    },
    // Reset the interval of spawing of a consummable
    ResetProduceInterval(state, obj: { job: Job }) {
      state.jobs[obj.job].produceRemainingTime = StaticJobInfo[obj.job].produceInterval;
    },
    // Reset the interval of consumming of a consummable
    ResetConsummeInterval(state, obj: { job: Job }) {
      state.jobs[obj.job].consumeRemainingTime = StaticJobInfo[obj.job].consumeInterval;
    },
    // Init the map
    InitMap(state, size: number) {
      state.map = MapBuilder.InitMap(size);
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state, obj: { x: number, y: number, type: Building }) {
      var previousTile = (state.map[obj.x])[obj.y];

      console.debug(`Changing tile ${obj.x}, ${obj.y} from ${previousTile.building} to ${obj.type}`);

      // TODO: fix this with a mapping
      if (previousTile.building == Building.Village)
        state.storage.villages.quantity--;

      if (previousTile.building == Building.Barn)
        state.storage.barns.quantity--;

      if (previousTile.building == Building.Farm)
        state.storage.farms.quantity--;

      (state.map[obj.x])[obj.y].building = obj.type;

      if (obj.type == Building.Village)
        state.storage.villages.quantity++;

      if (obj.type == Building.Barn)
        state.storage.barns.quantity++;

      if (obj.type == Building.Farm)
        state.storage.farms.quantity++;
    },
    //Add
    AddJob(state, obj: { jobName: Job, quantity: number }) {
      console.debug(`AddJob tile ${obj.jobName}, ${obj.quantity}`);
      state.jobs[obj.jobName].quantity += obj.quantity;
    },
  },
  actions: {

  },
  getters: {
    getRessourceStorage(state): (id: Consummable) => number {
      return (id: Consummable) => {
        var storage = StaticConsummableInfo[id].storage;
        if (storage === undefined)
          return -1;

        return state.storage[storage.name].quantity * storage.capacity;
      }
    }
  }
});
