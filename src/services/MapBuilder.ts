import { Environment } from "@/models/Environment";
import { Building } from "@/models/Building";
import { IMapTile } from "@/models/IMapTile";
import SimplexNoise from "simplex-noise";
import { Habitat } from "@/models/Habitat";
import { IMapBuildings } from "@/store/mapStoreModule";

export class MapBuilder {
  private static simplexHeight = new SimplexNoise();
  private static simplexTrees = new SimplexNoise();

  public static InitMap(
    size: number
  ): { map: IMapTile[][]; buildings: IMapBuildings } {
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

        let habitat: Habitat | null = null;
        if (
          (env == Environment.Field ||
            env == Environment.Beach ||
            env == Environment.Concrete) &&
          Math.random() > 0.97
        )
          habitat = MapBuilder.GetHabitat();

        let building = MapBuilder.GetBuilding(env, i, j);

        map[i][j] = {
          building: building,
          environment: env,
          habitat: habitat,
          discovered: false,
          discoverable: 0,
          pollution: 50,
          temperature: 20,
          closeByTrees: 0,
          quantity: 0,
          population: 0,
        };

        // All trees start with a quantity of 100
        if (building == Building.forest) {
          map[i][j].quantity = Math.floor(Math.random() * 100) + 1;
          forestBuildingEntry.quantity++;
          forestBuildingEntry.coords[i + "," + j] = { x: i, y: j };
        }
      }
    }

    // Build buildings
    map[center][center].environment = Environment.Field;
    map[center][center].quantity = 0;
    map[center][center].building = Building.village;

    map[center][center + 1].environment = Environment.Field;
    map[center][center + 1].quantity = 0;
    map[center][center + 1].building = Building.barn;

    map[center][center - 1].environment = Environment.Field;
    map[center][center - 1].quantity = 0;
    map[center][center - 1].building = Building.watchTower;

    map[center - 1][center].environment = Environment.Field;
    map[center - 1][center].quantity = 0;
    map[center - 1][center].building = Building.gathererHut;

    // Set discovered
    map[center][center].discovered = true;
    map[center][center + 1].discoverable = 1;
    map[center][center - 1].discoverable = 1;
    map[center + 1][center].discoverable = 1;
    map[center - 1][center].discoverable = 1;

    // Compute closeByTrees
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        let nbTrees = 0;
        if (i > 0 && map[i - 1][j].building == Building.forest) nbTrees++;
        if (j > 0 && map[i][j - 1].building == Building.forest) nbTrees++;
        if (i < mapSize - 1 && map[i + 1][j].building == Building.forest)
          nbTrees++;
        if (j < mapSize - 1 && map[i][j + 1].building == Building.forest)
          nbTrees++;

        map[i][j].closeByTrees = nbTrees;
      }
    }

    return {
      map: map,
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

  private static GetHabitat(): Habitat {
    var seed = Math.random();
    if (seed < 0.33) return Habitat.CoalDeposite;
    else if (seed < 0.66) return Habitat.StoneDeposite;
    else return Habitat.LimestoneDeposite;
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
