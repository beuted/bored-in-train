import { Building } from './Building';
import { Environment } from './Environment';

export interface IMapTile {
    building: Building | null;
    environment: Environment;
    discovered: boolean;
}