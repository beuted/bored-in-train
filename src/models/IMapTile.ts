import { Building } from "./Building";
import { Environment } from "./Environment";

export interface IMapTile {
  b: Building | null;
  e: Environment;
  discovered: boolean;
  discoverable: number;
  closeByTrees: number;
  q: number; // from 0 to N (100 for trees)
  r: number; // random for display
}
