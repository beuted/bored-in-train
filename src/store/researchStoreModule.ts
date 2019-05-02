import { Module } from 'vuex';

import { Storage } from '@/models/Storage';
import { ResearchInfo } from '../services/GameEngine';
import { IState } from '../store';
import { Research } from '@/models/Research';

export interface IResearchState {
  research: { [id in Research]: { owned: boolean } },
}

export const ResearchModule: Module<IResearchState, IState> = {
  state: {
    research: {
      agriculture: {
        owned: false
      },
      mining: {
        owned: false
      },
      steamLocomotive: {
        owned: false
      },
    },
  },
  mutations: {
    BuyResearch(state, obj: { researchName: Research }) {
      console.debug(`Buying research ${obj.researchName}`);
      state.research[obj.researchName].owned = true;
    },
  },
  getters: {
    researchStorageKnown(state) {
      let storageKnown: any = {};
      for (let storage in Storage) {
        for (let research in Research) {
          if (ResearchInfo[research as Research].unlocks.storages.findIndex(x => x == storage) != -1
              && !state.research[research as Research].owned) {
            storageKnown[storage] = false;
            break;
          }
        }

        if (storageKnown[storage] === undefined)
          storageKnown[storage] = true;
      }
      return storageKnown;
    }
  }
}