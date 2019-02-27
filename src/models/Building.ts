import { storage } from '@/store';

export enum Building {
    Foret = 0,
    Water = 1,
    Field = 2,
    House = 3,
    Barn = 4,
    Farm = 5,
}

export const BuildingToStorageMapping: {[id: number]: storage | undefined} = {
    0: undefined,
    1: undefined,
    2: undefined,
    3: storage.houses,
    4: storage.barns,
    5: undefined,
};