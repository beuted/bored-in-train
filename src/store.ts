import Vue from "vue";
import Vuex, { Store, Module } from "vuex";

import { Consumable } from "./models/Consumable";
import { StaticConsumableInfo } from "./services/GameEngine";
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
  hasWonTheGame: boolean;
  consumable: { [id in Consumable]: { quantity: number; isKnown: boolean } };
  consumablesProduced: { [id in Consumable]?: number };
}

function GetInitialConsumableState(): {
  [id in Consumable]: { quantity: number; isKnown: boolean };
} {
  let initialConsumableState = Object.keys(StaticConsumableInfo).reduce<
    Partial<{ [id in Consumable]: { quantity: number; isKnown: boolean } }>
  >((accumulator, consumable) => {
    accumulator[consumable as Consumable] = { quantity: 0, isKnown: false };
    return accumulator;
  }, {}) as { [id in Consumable]: { quantity: number; isKnown: boolean } };

  initialConsumableState[Consumable.population] = {
    quantity: 10,
    isKnown: true,
  };
  initialConsumableState[Consumable.wood] = { quantity: 10, isKnown: true };
  return initialConsumableState;
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
    hasWonTheGame: false,
    consumable: GetInitialConsumableState(),
    consumablesProduced: {},
  },
  mutations: {
    // For storeSaverPlugin
    StoreSaverRestore: function (state: IState, restoredState: IState) {
      Object.assign(state, restoredState);
    },
    // For storeSaverPlugin
    StoreSaverSetSaveStatus: function (
      state: IState,
      newSaveStatus: SaveStatus
    ) {
      state.saveStatus = newSaveStatus;
    },
    // Toggle debug
    ToggleShowHelp(state) {
      state.showHelp = !state.showHelp;
    },
    // Increment the value of a consumable from 'value'
    IncrementConsumable(state, obj: { name: Consumable; value: number }) {
      state.consumable[obj.name].quantity += obj.value;

      if (
        state.consumable[Consumable.population].quantity < 2 &&
        state.consumable[Consumable.wood].quantity < 2
      )
        state.consumable[Consumable.population].quantity += 2;
    },
    // Increment the value of a consumable from 'value'
    IncrementConsumables(state, production: { [id in Consumable]: number }) {
      for (let consumable in production) {
        state.consumable[consumable as Consumable].quantity +=
          production[consumable as Consumable];
      }

      if (
        state.consumable[Consumable.population].quantity < 2 &&
        state.consumable[Consumable.wood].quantity < 2
      )
        state.consumable[Consumable.population].quantity += 2;
    },
    WonTheGame(state, obj: { value: boolean }) {
      state.hasWonTheGame = obj.value;
    },
    ResetConsumablesProduced(state) {
      state.consumablesProduced = {};
    },
  },
  actions: {},
});
