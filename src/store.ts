import Vue from 'vue';
import Vuex, { Store, Module } from 'vuex';

import { Consummable } from './models/Consummable';
import { Job } from './models/Job';
import { StaticJobInfo } from './services/GameEngine';
import { IJobProductionEvent } from './EventBus';
import VuexPersist from 'vuex-persist'
import { MapModule, IMapState } from './store/mapStoreModule';
import { IResearchState, ResearchModule } from './store/researchStoreModule';

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
  research: IResearchState;
  debugMode: boolean;
  controls: { play: boolean, speed: number}
  consummable: { [id in Consummable]: { quantity: number } };
  jobs: { [id in Job]: { quantity: number } };
}

export default new Vuex.Store<IState>({
  plugins: [vuexPersist.plugin],
  strict: true,
  modules: {
    map: MapModule,
    research: ResearchModule
  },
  state: {
    map: <IMapState><any>null, // TODO: This hack is required to keep the type system happy
    research: <IResearchState><any>null, // TODO: This hack is required to keep the type system happy
    debugMode: false,
    controls: { play: true, speed: 1 },
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
      limestone: {
        quantity: 0,
      },
      knowledge: {
        quantity: 0,
      },
      energy: {
        quantity: 0,
      },
    },
    jobs: {
      berryGatherer: {
        quantity: 1,
      },
      woodGatherer: {
        quantity: 0,
      },
      explorer: {
        quantity: 0,
      },
      druid: {
        quantity: 0,
      },
      farmer: {
        quantity: 0,
      },
      stoneGatherer: {
        quantity: 0,
      },
      stoneMiner: {
        quantity: 0,
      },
      coalMiner: {
        quantity: 0,
      },
      limestoneMiner: {
        quantity: 0,
      },
      coalStationEngineer: {
        quantity: 0,
      },
      default: { //Job producing population
        quantity: 1,
      }
    }
  },
  mutations: {
    // Toggle debug
    ToggleDebugMode(state) {
      state.debugMode = !state.debugMode
      state.controls.speed = 10;
    },
    // Toggle play or pause
    TogglePlay(state) {
      state.controls.play = !state.controls.play
    },
    // Toggle fastforward
    ToggleFastForward(state) {
      if (state.controls.speed === 1)
        state.controls.speed = 2;
      else
        state.controls.speed = 1;
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
    //Add Job
    AddJob(state, obj: { jobName: Job, quantity: number }) {
      console.debug(`AddJob tile ${obj.jobName}, ${obj.quantity}`);
      state.jobs[obj.jobName].quantity += obj.quantity;
    },
  },
  actions: {

  }
});
