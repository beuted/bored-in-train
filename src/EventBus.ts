import Vue from 'vue';
import { Job } from './models/Job';
import { Consumable } from './models/Consumable';
export const EventBus = new Vue();

export interface IJobProductionEvent {
    job: Job;
    produced: { [id in Consumable]: number };
}

export interface IPopupMessageEvent {
    message: string;
    isHelp: boolean;
}