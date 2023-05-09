import { Environment } from "@/models/Environment";
import { Building } from "@/models/Building";
import { IMapTile } from "@/models/IMapTile";
import SimplexNoise from "simplex-noise";
import {
  getTilesForCircle,
  IMapBuildings,
  sawmillRadius,
} from "@/store/mapStoreModule";
import { StaticBuildingInfo } from "./GameEngine";

export class MapBuilder {
  private static simplexHeight = new SimplexNoise();
  private static simplexTrees = new SimplexNoise();

  public static InitMap(size: number): {
    map: IMapTile[][];
    mapSize: number;
    buildings: IMapBuildings;
  } {
    var center = Math.floor(size / 2);
    const mapSize = size;
    // Build Environment and natural Buildings (forests, ...)
    let map: IMapTile[][] = [];
    let forestBuildingEntry: {
      quantity: number;
      coords: { [xThenCommaThenY in string]: { x: number; y: number } };
    } = { quantity: 0, coords: {} };
    for (let i = 0; i < mapSize; i++) {
      map[i] = [];
      for (let j = 0; j < mapSize; j++) {
        let env = MapBuilder.GetHeightEnvironment(i, j, size);

        let building = MapBuilder.GetBuilding(env, i, j);

        if (
          (env == Environment.Field ||
            env == Environment.Beach ||
            env == Environment.Concrete) &&
          Math.random() > 0.97
        )
          building = MapBuilder.GetHabitat();

        map[i][j] = {
          b: building,
          e: env,
          discovered: false,
          discoverable: 0,
          closeByTrees: 0,
          q: 0,
          r: Math.floor(Math.random() * 100),
        };

        // All trees start with a quantity of 100
        if (building == Building.forest) {
          map[i][j].q = Math.floor(Math.random() * 100) + 1;
          forestBuildingEntry.quantity++;
          forestBuildingEntry.coords[i + "," + j] = { x: i, y: j };
        }
      }
    }

    // Set discovered
    var discoveredTiles = getTilesForCircle({ x: center, y: center }, 2);
    for (const tile of discoveredTiles) {
      map[tile.x][tile.y].discovered = true;
      map[tile.x][tile.y].b = null;
      map[tile.x][tile.y].q = 0;
      map[tile.x][tile.y].e = Environment.Field;
    }
    var discoverableTiles = getTilesForCircle({ x: center, y: center }, 3);
    for (const tile of discoverableTiles) {
      map[tile.x][tile.y].discoverable = 1;
    }

    // Compute closeByTrees
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        let nbTrees = 0;
        let nbWater = 0;
        let nbBeach = 0;
        let nbField = 0;
        let nbMountain = 0;

        var discoverableTiles = getTilesForCircle(
          { x: i, y: j },
          sawmillRadius
        );

        for (const tile of discoverableTiles) {
          if (
            tile.x > 0 &&
            tile.y > 0 &&
            tile.x < map.length - 1 &&
            tile.y < map.length - 1
          ) {
            const building = map[tile.x][tile.y].b;
            const environment = map[tile.x][tile.y].e;

            if (building == Building.forest) nbTrees++;

            if (environment == Environment.Water) nbWater++;
            else if (environment == Environment.Beach) nbBeach++;
            else if (environment == Environment.Field) nbField++;
            else if (environment == Environment.Concrete) nbMountain++;
          }
        }

        map[i][j].closeByTrees = nbTrees;
      }
    }

    let buildings: Partial<IMapBuildings> = {};

    for (let building in StaticBuildingInfo) {
      buildings[building as Building] = {
        quantity: 0,
        coords: {},
      };
    }

    buildings.forest = forestBuildingEntry;

    return {
      map: map,
      mapSize: mapSize,
      buildings: buildings as IMapBuildings,
    };
  }

  private static GetBuilding(
    env: Environment,
    i: number,
    j: number
  ): Building | null {
    if (MapBuilder.NoiseTrees(i, j) > 0.5) {
      if (env == Environment.Field) return Building.forest;
      if (env == Environment.Concrete)
        return Math.random() > 0.5 ? Building.forest : null;
    }
    return null;
  }

  private static GetHabitat(): Building {
    return Building.coalDeposite;
    //TODO: add here more habitats
  }

  private static GetHeightEnvironment(
    i: number,
    j: number,
    size: number
  ): Environment {
    let height = MapBuilder.Mask(i, j, size) * MapBuilder.NoiseHeight(i, j);
    if (height <= 0.01) return Environment.Water;
    if (height <= 0.1) return Environment.Beach;
    if (height <= 0.6) return Environment.Field;
    if (height <= 0.98) return Environment.Concrete;

    return Environment.Snow;
  }

  private static Mask(x: number, y: number, size: number) {
    let distance_x = Math.abs(x - size * 0.5);
    let distance_y = Math.abs(y - size * 0.5);
    let distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y); // circle mask

    let max_width = size * 0.5 - 2.0;
    let delta = distance / max_width;
    let gradient = delta * delta;

    return Math.max(0.0, 1.0 - gradient);
  }

  private static NoiseHeight(x: number, y: number) {
    return Math.pow(
      0.5 +
      0.9 * MapBuilder.simplexHeight.noise2D(x * 0.05, y * 0.05) +
      0.1 * MapBuilder.simplexHeight.noise2D(x * 0.3, y * 0.3),
      2
    );
  }

  private static NoiseTrees(x: number, y: number) {
    return 0.5 + 1 * MapBuilder.simplexTrees.noise2D(x * 0.05, y * 0.05);
  }
}
