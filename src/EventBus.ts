import Vue from "vue";
import { Building } from "./models/Building";
import { Consumable } from "./models/Consumable";
export const EventBus = new Vue();

export interface IProductionEvent {
  building: Building;
  produced: { [id in Consumable]: number };
}

export interface IPopupMessageEvent {
  message: string;
  isHelp: boolean;
}
