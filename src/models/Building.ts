import { storage } from '@/store';

export enum Building {
    Foret = 0,
    Water = 1,
    Field = 2,
    House = 3,
    Barn = 4,
    Farm = 5,
}

export const StorageToBuildingMapping: {[id in storage]: Building} = {
    'houses': Building.House,
    'barns': Building.Barn,
}