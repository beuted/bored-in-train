import {
  IStaticBuildingProduction,
  StaticConsumableInfo,
  IStaticConsumable,
  GlobalConfig,
  StaticBuildingInfo,
  IStaticBuilding,
} from "./GameEngine";
import { IProductionEvent, EventBus } from "@/EventBus";
import { Consumable } from "@/models/Consumable";
import store from "@/store";
import Vue from "vue";
import { MessageService } from "./MessageService";
import { Building } from "@/models/Building";

export class GameService {
  public static PopulationIncr = 0.5;

  private hasBeenInit = false;

  public constructor() {
    if (this.hasBeenInit) return;

    // NASTY HACK: This timeout is here to let all services init before starting the game.
    setTimeout(() => {
      this.mainLoop();
      this.hasBeenInit = true;
    }, 1000);

    console.log(`I'm bored in a train`);
  }

  private mainLoop() {
    this.handleMapChanges();

    // Recursive setTimeout for precision
    setTimeout(() => {
      this.mainLoop();
    }, GlobalConfig.TickInterval);
  }

  private handleMapChanges() {
    // Add and remove and spread pollution. Add and remove trees and handle discovery
    store.commit("ApplyMapChanges");
  }
}
