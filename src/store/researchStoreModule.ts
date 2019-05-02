import { Module } from 'vuex';

import { Storage } from '@/models/Storage';
import { ResearchInfo } from '../services/GameEngine';
import { IState } from '../store';
import { Research } from '@/models/Research';
import { Consummable } from '@/models/Consummable';

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
    OwnResearch(state, obj: { researchName: Research }) {
      state.research[obj.researchName].owned = true;
    },
  },
  actions: {
    BuyResearch(context, obj: { researchName: Research }) {
      console.debug(`Buying research ${obj.researchName}`);
      context.commit('OwnResearch', obj);
      context.commit('IncrementConsummable', { name: Consummable.knowledge, value: -ResearchInfo[obj.researchName as Research].price }, { root: true })
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