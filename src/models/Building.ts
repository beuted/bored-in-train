import { Storage } from '@/models/Storage';

export enum Building {
    NoBuilding = 0,
    Village = 1,
    Barn = 2,
    Farm = 3,
    CoalMine = 4,
}

export const StorageToBuildingMapping: {[id in Storage]: Building} = {
    [Storage.villages]: Building.Village,
    [Storage.barns]: Building.Barn,
    [Storage.farms]: Building.Farm,
    [Storage.coalMines]: Building.CoalMine,
}

export const BuildingToStorageMapping: {[id in Building]: Storage | null} = {
    [Building.NoBuilding]: null,
    [Building.Village]: Storage.villages,
    [Building.Barn]: Storage.barns,
    [Building.Farm]: Storage.farms,
    [Building.CoalMine]: Storage.coalMines,
}