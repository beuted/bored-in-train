import Vue from 'vue';
import Vuex, { Store, Module } from 'vuex';

import { Consummable } from './models/Consummable';
import { Job } from './models/Job';
import { IJobProductionEvent } from './EventBus';
import { MapModule, IMapState } from './store/mapStoreModule';
import { IResearchState, ResearchModule } from './store/researchStoreModule';
import { StoreSaver } from './store/storeSaver';
import { Building } from './models/Building';
import { StaticJobInfo, StaticBuildingInfo } from './services/GameEngine';


Vue.use(Vuex);

export abstract class IdleGameVue extends Vue {
  public $store!: Store<IState>;
}

export enum SaveStatus {
  Unsaved = 0,
  Saved = 1,
  Saving = 2,
}

export interface IState {
  saveStatus: SaveStatus;
  map: IMapState;
  research: IResearchState;
  debugMode: boolean;
  showHelp: boolean;
  controls: { speed: number}
  consummable: { [id in Consummable]: { quantity: number } };
}

export default new Vuex.Store<IState>({
  plugins: [],
  strict: true,
  modules: {
    map: MapModule,
    research: ResearchModule
  },
  state: {
    saveStatus: SaveStatus.Unsaved,
    map: <IMapState><any>null, // TODO: This hack is required to keep the type system happy
    research: <IResearchState><any>null, // TODO: This hack is required to keep the type system happy
    debugMode: false,
    showHelp: true,
    controls: { speed: 1 },
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
      limestoneBrick: {
        quantity: 0,
      },
      knowledge: {
        quantity: 0,
      },
      energy: {
        quantity: 0,
      },
    },
  },
  mutations: {
    // For storeSaverPlugin
    StoreSaverRestore: function (state: IState, restoredState: IState) {
      Object.assign(state, restoredState);
    },
    // For storeSaverPlugin
    StoreSaverSetSaveStatus: function (state: IState, newSaveStatus: SaveStatus) {
      state.saveStatus = newSaveStatus
    },
    // Toggle debug
    ToggleDebugMode(state) {
      state.debugMode = !state.debugMode;
      state.controls.speed = 10;
    },
    ToggleShowHelp(state) {
      state.showHelp = !state.showHelp;
    },
    // Toggle play or pause
    TogglePlay(state) {
      state.controls.speed = state.controls.speed < 1 ? 1 : 0;
    },
    // Set play
    SetPlay(state, play: boolean) {
      state.controls.speed = play ? 1 : 0;
    },
    // Toggle fastforward
    ToggleFastForward(state) {
        state.controls.speed = 2;
    },
    // Increment the value of a consummable from 'value'
    IncrementConsummable(state, obj: { name: Consummable, value: number }) {
      state.consummable[obj.name].quantity += obj.value;
    },
    // Increment the value of a consummable from 'value'
    IncrementConsummables(state, production: { [id in Consummable]: number }) {
      for (let consummable in production) {
        state.consummable[consummable as Consummable].quantity += production[consummable as Consummable];
      }
    },
    //Add Job
    AddJob(state, obj: { jobName: Job, quantity: number }) {
      console.debug(`AddJob tile ${obj.jobName}, ${obj.quantity}`);
      state.map.jobs[obj.jobName].quantity += obj.quantity;

      const storage = StaticJobInfo[obj.jobName].storage;
      // Add these new workers on buildings
      if (obj.quantity > 0 && storage != undefined) {
        let toBeAdded = obj.quantity;
        var buildingCoords = state.map.buildings[storage.name].coords;
        for (let coord of Object.values(buildingCoords)) {
          if (state.map.map[coord.x][coord.y].population < storage.capacity) {
            let toAdd = Math.min(toBeAdded, storage.capacity - state.map.map[coord.x][coord.y].population);
            state.map.map[coord.x][coord.y].population += toAdd;
            toBeAdded -= toAdd;
            if (toBeAdded <= 0) {
              break;
            }
          }
        }
      }

      // Remove these new workers from buildings
      else if (obj.quantity < 0 && storage != undefined) {
        let toBeRemoved = -obj.quantity;
        var buildingCoords = state.map.buildings[storage.name].coords;
        for (let coord of Object.values(buildingCoords)) {
          if (state.map.map[coord.x][coord.y].population > 0) {
            let toRemove = Math.min(toBeRemoved, state.map.map[coord.x][coord.y].population);
            state.map.map[coord.x][coord.y].population -= toRemove;
            toBeRemoved -= toRemove;
            if (toBeRemoved <= 0) {
              break;
            }
          }
        }
      }
    },
  },
  actions: {

  }
});
