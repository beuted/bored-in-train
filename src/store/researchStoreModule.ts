import { Module } from "vuex";

import { ResearchInfo, StaticBuildingInfo } from "../services/GameEngine";
import { IState } from "../store";
import { Research } from "@/models/Research";
import { Consumable } from "@/models/Consumable";
import { Building } from "@/models/Building";
import { Vue } from "vue-property-decorator";

export interface IResearchState {
  research: { [id in Research]: { owned: boolean } };
  buildingsKnown: { [key in Building]?: boolean };
}

function GetInitialResearchState(): { [id in Research]: { owned: boolean } } {
  let initialResearchState = Object.keys(ResearchInfo).reduce<
    Partial<{ [id in Research]: { owned: boolean } }>
  >((accumulator, research) => {
    accumulator[research as Research] = { owned: false };
    return accumulator;
  }, {}) as { [id in Research]: { owned: boolean } };

  return initialResearchState;
}

export const ResearchModule: Module<IResearchState, IState> = {
  state: {
    research: GetInitialResearchState(),
    buildingsKnown: {
      [Building.village]: true,
      [Building.gathererCamp]: true,
      [Building.watchTower]: true,
    },
  },
  mutations: {
    OwnResearch(state, obj: { researchName: Research }) {
      state.research[obj.researchName].owned = true;
      for (const building of ResearchInfo[obj.researchName as Research].unlocks
        .buildings) {
        state.buildingsKnown[building] = true;
      }
    },
    AddKnownBuilding(state, obj: { building: Building }) {
      if (!!state.buildingsKnown[obj.building]) return;
      state.buildingsKnown[obj.building] = true;
      Vue.toasted.success(
        `You discovered the building "${
          StaticBuildingInfo[obj.building].name
        }"!`
      );
    },
  },
  actions: {
    BuyResearch(context, obj: { researchName: Research }) {
      console.debug(`Buying research ${obj.researchName}`);
      context.commit("OwnResearch", obj);

      for (let consumable in ResearchInfo[obj.researchName].price) {
        context.commit(
          "IncrementConsumable",
          {
            name: consumable,
            value: -ResearchInfo[obj.researchName as Research].price[
              consumable as Consumable
            ]!,
          },
          { root: true }
        );
      }
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
      return state.buildingsKnown;
    },
  },
};
