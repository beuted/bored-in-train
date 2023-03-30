import { Module } from "vuex";

import { ResearchInfo } from "../services/GameEngine";
import { IState } from "../store";
import { Research } from "@/models/Research";
import { Consumable } from "@/models/Consumable";
import { Building } from "@/models/Building";

export interface IResearchState {
  research: { [id in Research]: { owned: boolean } };
}

export const ResearchModule: Module<IResearchState, IState> = {
  state: {
    research: {
      agriculture: {
        owned: false,
      },
      woodcutting: {
        owned: false,
      },
      mining: {
        owned: false,
      },
      factory: {
        owned: false,
      },
      navigation: {
        owned: false,
      },
      steamLocomotive: {
        owned: false,
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
      context.commit("OwnResearch", obj);
      context.commit(
        "IncrementConsumable",
        {
          name: Consumable.knowledge,
          value: -ResearchInfo[obj.researchName as Research].price,
        },
        { root: true }
      );
    },
  },
  getters: {
    availableResearchs(state) {
      let availableResearchs: Research[] = [];

      for (let research in Research) {
        let allPrerequisitOwned = true;
        for (let prerequisite of ResearchInfo[research as Research]
          .prerequisite) {
          if (!state.research[prerequisite as Research].owned) {
            allPrerequisitOwned = false;
            break;
          }
        }

        if (allPrerequisitOwned) availableResearchs.push(research as Research);
      }

      return availableResearchs;
    },

    researchBuildingsKnown(state) {
      let buildingKnown: any = {};
      for (let building in Building) {
        for (let research in Research) {
          if (
            ResearchInfo[research as Research].unlocks.buildings.findIndex(
              (x) => x == building
            ) != -1 &&
            !state.research[research as Research].owned
          ) {
            buildingKnown[building] = false;
            break;
          }
        }

        if (buildingKnown[building] === undefined)
          buildingKnown[building] = true;
      }
      return buildingKnown;
    },

    canSail(state) {
      return state.research[Research.navigation].owned;
    },
  },
};
