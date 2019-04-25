import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import { Building, BuildingToStorageMapping } from '@/models/Building';
import { MapBuilder } from './services/MapBuilder';
import { Consummable } from './models/Consummable';
import { Storage } from '@/models/Storage';
import { Job } from './models/Job';
import { StaticConsummableInfo, StaticJobInfo } from './services/GameEngine';
import { IJobProductionEvent } from './EventBus';

Vue.use(Vuex);


export abstract class IdleGameVue extends Vue {
  public $store!: Store<IState>;
}

export interface IState {
  debugMode: boolean,
  map: { building: number, environment: number }[][],
  consummable: { [id in Consummable]: { quantity: number } },
  storage: { [id in Storage]: { quantity: number } },
  jobs: { [id in Job]: { quantity: number, remainingTime: number } },
}

//TODO: override with something like this
//interface Vue {
//  $store: Store<IState>;
//}

export default new Vuex.Store<IState>({
  strict: true,
  state: {
    debugMode: false,
    map: [],
    consummable: {
      population: {
        quantity: 6,
      },
      food: {
        quantity: 5,
      },
      sticks: {
        quantity: 10,
      },
      stones: {
        quantity: 0,
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
      berryGatherer: {
        quantity: 1,
        remainingTime: 1000,
      },
      woodGatherer: {
        quantity: 0,
        remainingTime: 1000,
      },
      farmer: {
        quantity: 0,
        remainingTime: 1000,
      },
      stoneGatherer: {
        quantity: 0,
        remainingTime: 1000,
      },
      default: { //Job producing population
        quantity: 1,
        remainingTime: 1000,
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
    },
    // Increment the value of a consummable from 'value'
    IncrementConsummables(state, event: IJobProductionEvent) {
      for (let consummable in event.produced) {
        state.consummable[consummable as Consummable].quantity += event.produced[consummable as Consummable];
      }
    },
    // Decremente the remaining time before a spawn of a consummable from 1 tick (1000 ms)
    TickInterval(state, obj: { job: Job} ) {
      state.jobs[obj.job].remainingTime -= 1000;
      //TODO tick the default job ?
    },
    // Reset the interval of spawning/consumming of a consummable
    ResetInterval(state, obj: { job: Job }) {
      state.jobs[obj.job].remainingTime = StaticJobInfo[obj.job].interval;
    },
    // Init the map
    InitMap(state, size: number) {
      state.map = MapBuilder.InitMap(size);
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state, obj: { x: number, y: number, type: Building }) {
      var previousTile = (state.map[obj.x])[obj.y];

      console.debug(`Changing tile ${obj.x}, ${obj.y} from ${previousTile.building} to ${obj.type}`);

      let storageTypeToDestroy = (BuildingToStorageMapping as any)[previousTile.building]
      if (storageTypeToDestroy != null) {
        (state.storage as any)[storageTypeToDestroy].quantity--;
      }

      (state.map[obj.x])[obj.y].building = obj.type;

      let storageTypeToBuild = (BuildingToStorageMapping as any)[obj.type]
      if (storageTypeToBuild != null) {
        (state.storage as any)[storageTypeToBuild].quantity++;
      }
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
