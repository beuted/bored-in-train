import { Storage } from '@/models/Storage';

export enum Building {
    NoBuilding = 0,
    Village = 1,
    Barn = 2,
    Farm = 3,
}

export const StorageToBuildingMapping: {[id in Storage]: Building} = {
    'villages': Building.Village,
    'barns': Building.Barn,
    'farms': Building.Farm,
}