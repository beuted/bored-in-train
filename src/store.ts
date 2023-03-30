import Vue from "vue";
import Vuex, { Store, Module } from "vuex";

import { Consumable } from "./models/Consumable";
import { MapModule, IMapState } from "./store/mapStoreModule";
import { IResearchState, ResearchModule } from "./store/researchStoreModule";

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
  controls: { speed: number };
  consumable: { [id in Consumable]: { quantity: number } };
  popStorage: number;
}

export default new Vuex.Store<IState>({
  plugins: [],
  strict: true,
  modules: {
    map: MapModule,
    research: ResearchModule,
  },
  state: {
    saveStatus: SaveStatus.Unsaved,
    map: <IMapState>(<any>null), // TODO: This hack is required to keep the type system happy
    research: <IResearchState>(<any>null), // TODO: This hack is required to keep the type system happy
    debugMode: false,
    showHelp: true,
    controls: { speed: 1 },
    consumable: {
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
    popStorage: 10,
  },
  mutations: {
    // For storeSaverPlugin
    StoreSaverRestore: function(state: IState, restoredState: IState) {
      Object.assign(state, restoredState);
    },
    // For storeSaverPlugin
    StoreSaverSetSaveStatus: function(
      state: IState,
      newSaveStatus: SaveStatus
    ) {
      state.saveStatus = newSaveStatus;
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
      if (state.controls.speed != 2) state.controls.speed = 2;
      else state.controls.speed = 1;
    },
    // Increment the value of a consumable from 'value'
    IncrementConsumable(state, obj: { name: Consumable; value: number }) {
      state.consumable[obj.name].quantity += obj.value;
    },
    // Increment the value of a consumable from 'value'
    IncrementConsumables(state, production: { [id in Consumable]: number }) {
      for (let consumable in production) {
        state.consumable[consumable as Consumable].quantity +=
          production[consumable as Consumable];
      }
    },
    IncrementPopStorage(state, obj: { value: number }) {
      state.popStorage += obj.value;
    },
  },
  actions: {},
});
