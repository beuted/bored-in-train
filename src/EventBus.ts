import Vue from 'vue';
import { Job } from './models/Job';
import { Consummable } from './models/Consummable';
export const EventBus = new Vue();

export interface IJobProductionEvent {
    job: Job;
    produced: { [id in Consummable]: number };
}

export interface IPopupMessageEvent {
    message: string;
    isHelp: boolean;
}