import { Building } from "./Building";
import { Environment } from "./Environment";

export interface IMapTile {
  building: Building | null;
  environment: Environment;
  discovered: boolean;
  discoverable: number;
  pollution: number; // from 0 to 100
  temperature: number; // In celcius
  closeByTrees: number;
  closeByWater: number;
  closeByMountain: number;
  closeByField: number;
  closeByBeach: number;
  quantity: number; // from 0 to N (100 for trees)
  disabled?: boolean | undefined; // When a building stopped working (ie: no trees next to a sawmill)
}
