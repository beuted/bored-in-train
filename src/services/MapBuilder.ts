import { Environment } from "@/models/Environment";
import { Building } from "@/models/Building";
import { IMapTile } from "@/models/IMapTile";
import SimplexNoise from "simplex-noise";
import {
  getTilesForCircle,
  IMapBuildings,
  IMapProduction,
  sawmillRadius,
} from "@/store/mapStoreModule";
import { GameService } from "./GameService";

export class MapBuilder {
  private static simplexHeight = new SimplexNoise();
  private static simplexTrees = new SimplexNoise();

  public static InitMap(
    size: number
  ): {
    map: IMapTile[][];
    mapSize: number;
    buildings: IMapBuildings;
    production: IMapProduction;
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
          building: building,
          environment: env,
          discovered: false,
          discoverable: 0,
          pollution: 50,
          temperature: 20,
          closeByTrees: 0,
          closeByWater: 0,
          closeByMountain: 0,
          closeByBeach: 0,
          closeByField: 0,
          quantity: 0,
        };

        // All trees start with a quantity of 100
        if (building == Building.forest) {
          map[i][j].quantity = Math.floor(Math.random() * 100) + 1;
          forestBuildingEntry.quantity++;
          forestBuildingEntry.coords[i + "," + j] = { x: i, y: j };
        }
      }
    }

    // Set discovered
    var discoveredTiles = getTilesForCircle({ x: center, y: center }, 2);
    for (const tile of discoveredTiles) {
      map[tile.x][tile.y].discovered = true;
      map[tile.x][tile.y].building = null;
      map[tile.x][tile.y].quantity = 0;
      map[tile.x][tile.y].environment = Environment.Field;
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
            const building = map[tile.x][tile.y].building;
            const environment = map[tile.x][tile.y].environment;

            if (building == Building.forest) nbTrees++;

            if (environment == Environment.Water) nbWater++;
            else if (environment == Environment.Beach) nbBeach++;
            else if (environment == Environment.Field) nbField++;
            else if (environment == Environment.Concrete) nbMountain++;
          }
        }

        map[i][j].closeByTrees = nbTrees;
        map[i][j].closeByWater = nbWater;
        map[i][j].closeByBeach = nbBeach;
        map[i][j].closeByField = nbField;
        map[i][j].closeByMountain = nbMountain;
      }
    }

    return {
      map: map,
      mapSize: mapSize,
      production: {
        population: { quantity: GameService.PopulationIncr },
        food: { quantity: 0 },
        wood: { quantity: 0 },
        stones: { quantity: 0 },
        coals: { quantity: 0 },
        limestone: { quantity: 0 },
        limestoneBrick: { quantity: 0 },
        knowledge: { quantity: 0 },
        energy: { quantity: 0 },
      },
      buildings: {
        village: {
          quantity: 1,
          coords: { [center + "," + center]: { x: center, y: center } },
        },
        gathererHut: {
          quantity: 1,
          coords: { [center - 1 + "," + center]: { x: center - 1, y: center } },
        },
        druidHut: {
          quantity: 0,
          coords: {},
        },
        watchTower: {
          quantity: 1,
          coords: {
            [center + "," + (center - 1)]: { x: center, y: center - 1 },
          },
        },
        barn: {
          quantity: 1,
          coords: {
            [center + "," + (center + 1)]: { x: center, y: center + 1 },
          },
        },
        farm: {
          quantity: 0,
          coords: {},
        },
        stoneMine: {
          quantity: 0,
          coords: {},
        },
        sawmill: {
          quantity: 0,
          coords: {},
        },
        coalMine: {
          quantity: 0,
          coords: {},
        },
        limestoneMine: {
          quantity: 0,
          coords: {},
        },
        limestoneBrickFactory: {
          quantity: 0,
          coords: {},
        },
        coalPowerStation: {
          quantity: 0,
          coords: {},
        },
        windmill: {
          quantity: 0,
          coords: {},
        },
        stoneWatchTower: {
          quantity: 0,
          coords: {},
        },
        coalDeposite: {
          quantity: 0,
          coords: {},
        },
        limestoneDeposite: {
          quantity: 0,
          coords: {},
        },
        lighthouse: {
          quantity: 0,
          coords: {},
        },
        forest: forestBuildingEntry,
      },
    };
  }

  private static GetBuilding(
    env: Environment,
    i: number,
    j: number
  ): Building | null {
    if (
      (env == Environment.Field || env == Environment.Concrete) &&
      MapBuilder.NoiseTrees(i, j) > 0.5
    ) {
      return Building.forest;
    }
    return null;
  }

  private static GetHabitat(): Building {
    var seed = Math.random();
    if (seed < 0.5) return Building.coalDeposite;
    else return Building.limestoneDeposite;
  }

  private static GetHeightEnvironment(
    i: number,
    j: number,
    size: number
  ): Environment {
    let height = MapBuilder.Mask(i, j, size) * MapBuilder.NoiseHeight(i, j);
    if (height <= 0.01) return Environment.Water;
    if (height <= 0.2) return Environment.Beach;
    if (height <= 0.75) return Environment.Field;
    if (height <= 0.95) return Environment.Concrete;

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
