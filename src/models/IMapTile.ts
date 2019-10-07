import { Building } from './Building';
import { Environment } from './Environment';
import { Habitat } from './Habitat';

export interface IMapTile {
    building: Building | null;
    environment: Environment;
    habitat: Habitat | null;
    discovered: boolean;
    discoverable: number;
}