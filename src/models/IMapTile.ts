import { Building } from './Building';
import { Environment } from './Environment';
import { Habitat } from './Habitat';

export interface IMapTile {
    building: Building | null;
    environment: Environment;
    habitat: Habitat | null;
    discovered: boolean;
    discoverable: number;
    pollution: number; // from 0 to 100
    temperature: number; // In celcius
    closeByTrees: number;
    quantity: number; // from 0 to N (100 for trees)
    population: number;
    disabled?: boolean | undefined; // When a building stopped working (ie: no trees next to a sawmill)
}