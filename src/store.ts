import Vue from 'vue';
import Vuex, { Store, Module } from 'vuex';

import { Consummable } from './models/Consummable';
import { Job } from './models/Job';
import { StaticJobInfo } from './services/GameEngine';
import { IJobProductionEvent } from './EventBus';
import { Research } from './models/Research';
import VuexPersist from 'vuex-persist'
import { MapModule, IMapState } from './store/mapStoreModule';

const vuexPersist = new VuexPersist({
  key: 'boring-idle-game',
  storage: localStorage
});

Vue.use(Vuex);

export abstract class IdleGameVue extends Vue {
  public $store!: Store<IState>;
}

export interface IState {
  map: IMapState;
  debugMode: boolean,
  consummable: { [id in Consummable]: { quantity: number } },
  jobs: { [id in Job]: { quantity: number, remainingTime: number } },
  research: { [id in Research]: { owned: boolean } },
}

export default new Vuex.Store<IState>({
  plugins: [vuexPersist.plugin],
  strict: true,
  modules: {
    map: MapModule
  },
  state: {
    map: <IMapState><any>null, // TODO: This hack is required to keep the type system happy
    debugMode: false,
    consummable: {
      population: {
        quantity: 6,
      },
      food: {
        quantity: 5,
      },
      wood: {
        quantity: 10,
      },
      stones: {
        quantity: 0,
      },
      coals: {
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
      explorer: {
        quantity: 0,
        remainingTime: 1000,
      },
      scientist: {
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
      miner: {
        quantity: 0,
        remainingTime: 1000,
      },
      default: { //Job producing population
        quantity: 1,
        remainingTime: 1000,
      }
    },
    research: {
      agriculture: {
        owned: false
      },
      steamLocomotive: {
        owned: false
      },
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
    //Add Job
    AddJob(state, obj: { jobName: Job, quantity: number }) {
      console.debug(`AddJob tile ${obj.jobName}, ${obj.quantity}`);
      state.jobs[obj.jobName].quantity += obj.quantity;
    },
    BuyResearch(state, obj: { researchName: Research }) {
      console.debug(`Buying research ${obj.researchName}`);
      state.research[obj.researchName].owned = true;
    },
  },
  actions: {

  }
});
