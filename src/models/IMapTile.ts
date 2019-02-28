import { Building } from './Building';
import { Environment } from './Environment';

export interface IMapTile {
    building : Building;
    environment: Environment;
}