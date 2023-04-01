import { Module, createNamespacedHelpers } from "vuex";

import { Building } from "@/models/Building";
import { MapBuilder } from "../services/MapBuilder";
import { Consumable } from "../models/Consumable";
import {
  StaticConsumableInfo,
  StaticBuildingInfo,
} from "../services/GameEngine";
import { Environment } from "../models/Environment";
import { IMapTile } from "../models/IMapTile";
import { UtilService } from "../services/UtilService";
import { IState } from "../store";
import Vue from "vue";
import { MessageService } from "@/services/MessageService";

export interface IMapState {
  mapNbTileFound: number;
  map: IMapTile[][];
  mapSize: number;
  mapNeedsUpdate: boolean;
  buildings: IMapBuildings;
}

//TODO: remove quantity use lenght
export type IMapBuildings = {
  [id in Building]: {
    quantity: number;
    coords: { [xThenCommaThenY in string]: { x: number; y: number } };
  }
};

const watchTowerOrderOfDiscovery = [
  [{ i: 0, j: 0 }],
  [{ i: 0, j: 1 }, { i: 1, j: 0 }, { i: 0, j: -1 }, { i: -1, j: 0 }], // radius 0.1
  [{ i: 1, j: 1 }, { i: 1, j: -1 }, { i: -1, j: -1 }, { i: -1, j: 1 }], // radius 1
  [
    { i: 0, j: 2 },
    { i: 0, j: -2 },
    { i: 1, j: 2 },
    { i: 1, j: -2 },
    { i: 2, j: 0 },
    { i: 2, j: 1 },
    { i: 2, j: -1 },
    { i: -1, j: 2 },
    { i: -1, j: -2 },
    { i: -2, j: 0 },
    { i: -2, j: 1 },
    { i: -2, j: -1 },
  ], // radius 2
  [
    { i: 0, j: 3 },
    { i: 0, j: -3 },
    { i: 1, j: 3 },
    { i: 1, j: -3 },
    { i: 2, j: 2 },
    { i: 2, j: 3 },
    { i: 2, j: -2 },
    { i: 2, j: -3 },
    { i: 3, j: 0 },
    { i: 3, j: 1 },
    { i: 3, j: 2 },
    { i: 3, j: -1 },
    { i: 3, j: -2 },
    { i: -1, j: 3 },
    { i: -1, j: -3 },
    { i: -2, j: 2 },
    { i: -2, j: 3 },
    { i: -2, j: -2 },
    { i: -2, j: -3 },
    { i: -3, j: 0 },
    { i: -3, j: 1 },
    { i: -3, j: 2 },
    { i: -3, j: -1 },
    { i: -3, j: -2 },
  ], // radius 3
];

export const sawmillRadius = 2;

export function getTilesForCircle(
  center: { x: number; y: number },
  radius: number,
  excludeCenter = false
) {
  var res: { x: number; y: number }[] = excludeCenter ? [] : [center];
  if (radius >= 1) {
    res = res.concat(
      watchTowerOrderOfDiscovery[1].map((tile) => ({
        x: tile.i + center.x,
        y: tile.j + center.y,
      }))
    );
  }
  if (radius >= 2) {
    res = res.concat(
      watchTowerOrderOfDiscovery[2].map((tile) => ({
        x: tile.i + center.x,
        y: tile.j + center.y,
      }))
    );
  }
  if (radius >= 3) {
    res = res.concat(
      watchTowerOrderOfDiscovery[3].map((tile) => ({
        x: tile.i + center.x,
        y: tile.j + center.y,
      }))
    );
  }
  if (radius >= 4) {
    res = res.concat(
      watchTowerOrderOfDiscovery[4].map((tile) => ({
        x: tile.i + center.x,
        y: tile.j + center.y,
      }))
    );
  }
  return res;
}

export const MapModule: Module<IMapState, IState> = {
  state: {
    mapNbTileFound: 5,
    map: [],
    mapSize: 42,
    mapNeedsUpdate: true,
    buildings: {
      village: {
        quantity: 0,
        coords: {},
      },
      gathererHut: {
        quantity: 0,
        coords: {},
      },
      druidHut: {
        quantity: 0,
        coords: {},
      },
      watchTower: {
        quantity: 0,
        coords: {},
      },
      barn: {
        quantity: 0,
        coords: {},
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
      forest: {
        quantity: 0,
        coords: {},
      },
    },
  },
  actions: {},
  mutations: {
    // Init the map
    InitMap(state: IMapState, size: number) {
      const res = MapBuilder.InitMap(size);

      state.map = res.map;
      state.mapSize = res.mapSize;
      state.buildings = res.buildings;

      state.mapNeedsUpdate = true;
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(
      state: IMapState,
      obj: { x: number; y: number; type: Building | null }
    ) {
      ChangeTile(state.map, state.buildings, obj);
      state.mapNeedsUpdate = true;
    },
    MakeTileDiscovered(state: IMapState, obj: { x: number; y: number }) {
      console.log("MakeTileDiscovered start...");
      let startTime = Date.now();

      let mapCopy = JSON.parse(JSON.stringify(state.map)); // TODO: better way to clone T[][] ?

      MakeTileDiscovered(mapCopy, obj);
      state.mapNbTileFound++;

      state.map = mapCopy;
      state.mapNeedsUpdate = true;
      console.log(
        "MakeTileDiscovered stop, elapsed time:",
        Date.now() - startTime,
        "ms"
      );
    },
    MapHaveBeenUpdated(state: IMapState) {
      state.mapNeedsUpdate = false;
    },
    MapNeedsUpdate(state: IMapState) {
      state.mapNeedsUpdate = true;
    },
    ApplyMapChanges(state: IMapState, canSail) {
      let mapLength = state.map.length;
      let mapCopy = JSON.parse(JSON.stringify(state.map)) as IMapTile[][]; // TODO: better way to clone T[][] ?
      let mapNbTileFoundCopy = state.mapNbTileFound;

      for (let i = 0; i < mapLength; i++) {
        for (let j = 0; j < mapLength; j++) {
          // Add and remove Tree quantity
          if (
            mapCopy[i][j].building == Building.forest &&
            mapCopy[i][j].quantity < 100
          ) {
            mapCopy[i][j].quantity++;
          }

          if (mapCopy[i][j].building == Building.sawmill) {
            const quantityToRemove = 3 / mapCopy[i][j].closeByTrees;
            var tiles = getTilesForCircle({ x: i, y: j }, sawmillRadius, true);

            for (const tile of tiles) {
              if (
                tile.x > 0 &&
                tile.y > 0 &&
                tile.x < mapCopy.length - 1 &&
                tile.y < mapCopy.length - 1 &&
                mapCopy[tile.x][tile.y].building == Building.forest
              ) {
                mapCopy[tile.x][tile.y].quantity -= quantityToRemove;
              }
            }
          }

          // Add and remove pollution
          if (
            mapCopy[i][j].building == Building.forest &&
            mapCopy[i][j].pollution > 0
          ) {
            mapCopy[i][j].pollution--;
          } else if (
            mapCopy[i][j].building != null &&
            mapCopy[i][j].pollution < 100
          ) {
            mapCopy[i][j].pollution++;
          }

          // Discover tiles
          if (mapCopy[i][j].building == Building.watchTower) {
            let TileDiscovered = false;
            for (let possibleTiles of watchTowerOrderOfDiscovery) {
              for (let possibleTile of possibleTiles) {
                // TODO: order not random ?
                if (
                  i + possibleTile.i < 0 ||
                  j + possibleTile.j < 0 ||
                  i + possibleTile.i >= state.mapSize ||
                  j + possibleTile.j >= state.mapSize ||
                  mapCopy[i + possibleTile.i][j + possibleTile.j].discovered ||
                  (mapCopy[i + possibleTile.i][j + possibleTile.j]
                    .environment == Environment.Water &&
                    !canSail)
                )
                  continue;
                console.log(
                  mapCopy[i + possibleTile.i][j + possibleTile.j].discovered
                );
                MakeTileDiscovered(mapCopy, {
                  x: i + possibleTile.i,
                  y: j + possibleTile.j,
                });
                mapNbTileFoundCopy++;
                TileDiscovered = true;
                break;
              }
              if (TileDiscovered) break;
            }

            if (!TileDiscovered) {
              // watch tower is useless
              delete state.buildings[Building.watchTower].coords[i + "," + j];
              mapCopy[i][j].building = null;
              mapCopy[i][j].quantity = 0;
              mapCopy[i][j].population = 0;
            }
          }
        }
      }

      for (let i = 1; i < mapLength; i++) {
        for (let j = 1; j < mapLength; j++) {
          // Spread polution
          let pollutionMedian =
            (mapCopy[i][j].pollution +
              mapCopy[i - 1][j].pollution +
              mapCopy[i][j - 1].pollution) /
            3;
          mapCopy[i - 1][j].pollution = pollutionMedian;
          mapCopy[i][j - 1].pollution = pollutionMedian;
          mapCopy[i][j].pollution = pollutionMedian;

          // Remove tree if quantity hit 0
          if (
            mapCopy[i][j].building == Building.forest &&
            mapCopy[i][j].quantity <= 0
          ) {
            console.log("Forest exausted...");
            MessageService.Help(
              "Your lumberjacks have destroyed a forest... Try to have more trees around your Sawmills to let the forests naturally regenerate.",
              "forest-exausted"
            );
            Vue.toasted.error(`Your lumberjacks have destroyed a forest`);
            ChangeTile(mapCopy, state.buildings, { x: i, y: j, type: null });
            mapCopy[i][j].quantity = 0;
          }
        }
      }

      state.mapNbTileFound = mapNbTileFoundCopy++;
      state.map = mapCopy;
      state.mapNeedsUpdate = true;
    },
  },
  getters: {
    getRessourceStorage(state): (id: Consumable) => number {
      return (id: Consumable) => {
        var storage = StaticConsumableInfo[id].storage;
        if (storage === undefined) return -1;

        return state.buildings[storage.name].quantity * storage.capacity;
      };
    },
  },
};

function updateCloseByTreeAndSawmill(
  pos: { x: number; y: number },
  map: IMapTile[][],
  buildings: IMapBuildings,
  increment: number
) {
  map[pos.x][pos.y].closeByTrees += increment;
  if (
    map[pos.x][pos.y].building == Building.sawmill &&
    map[pos.x][pos.y].closeByTrees <= 0
  ) {
    delete buildings[Building.sawmill].coords[pos.x + "," + pos.y];
    buildings[Building.sawmill].quantity--;
    // We do not remove the building from state.map so that it still appear on the map

    map[pos.x][pos.y].population = 0;
    map[pos.x][pos.y].disabled = true;

    Vue.toasted.error(
      "A sawmill stopped working due to a lack of forest nearby"
    );
  } else if (
    map[pos.x][pos.y].building == Building.sawmill &&
    map[pos.x][pos.y].closeByTrees > 0 &&
    !buildings[Building.sawmill].coords[pos.x + "," + pos.y]
  ) {
    // Once a tree is planted we might reactivate the sawmills next to it
    buildings[Building.sawmill].coords[pos.x + "," + pos.y] = {
      x: pos.x,
      y: pos.y,
    };
    buildings[Building.sawmill].quantity++;
    delete map[pos.x][pos.y].disabled;

    Vue.toasted.success(
      "Your sawmill started working again thanks to the new forest"
    );
  }
}

function UpdateNbTreeNearBy(
  pos: { x: number; y: number },
  map: IMapTile[][],
  buildings: IMapBuildings,
  increment: number
) {
  var tiles = getTilesForCircle(pos, sawmillRadius, true);

  for (const tile of tiles) {
    if (
      tile.x > 0 &&
      tile.y > 0 &&
      tile.x < map.length - 1 &&
      tile.y < map.length - 1
    )
      updateCloseByTreeAndSawmill(
        { x: tile.x, y: tile.y },
        map,
        buildings,
        increment
      );
  }
}

function ChangeTile(
  map: IMapTile[][],
  buildings: IMapBuildings,
  obj: { x: number; y: number; type: Building | null }
) {
  var previousTile = map[obj.x][obj.y];

  console.debug(
    `Changing tile ${obj.x}, ${obj.y} from ${previousTile.building} to ${
      obj.type
    }`
  );

  if (previousTile.building != null && !previousTile.disabled) {
    buildings[previousTile.building].quantity--;
    delete buildings[previousTile.building].coords[obj.x + "," + obj.y];
  }

  // We need to update nbTreeNearby if a forest is added or deleted
  if (previousTile.building == Building.forest || obj.type == Building.forest) {
    let increment =
      (obj.type == Building.forest ? 1 : 0) -
      (previousTile.building == Building.forest ? 1 : 0);
    UpdateNbTreeNearBy(obj, map, buildings, increment);
  }

  map[obj.x][obj.y].building = obj.type;
  map[obj.x][obj.y].quantity = 0;
  map[obj.x][obj.y].population = 0;
  delete map[obj.x][obj.y].disabled;

  // If we're building a tree update the quantity
  if (obj.type == Building.forest) {
    map[obj.x][obj.y].quantity = 20;
  }

  if (obj.type != null) {
    buildings[obj.type].quantity++;
    buildings[obj.type].coords[obj.x + "," + obj.y] = { x: obj.x, y: obj.y };
  }
}

function MakeTileDiscovered(
  map: IMapTile[][],
  coord: { x: number; y: number }
) {
  map[coord.x][coord.y].discovered = true;
  map[coord.x][coord.y].discoverable = 0;

  let mapLength = map.length;
  if (coord.y < mapLength - 1) {
    if (!map[coord.x][coord.y + 1].discovered) {
      map[coord.x][coord.y + 1].discoverable++;
    }
  }

  if (coord.y > 0) {
    if (!map[coord.x][coord.y - 1].discovered) {
      map[coord.x][coord.y - 1].discoverable++;
    }
  }

  if (coord.x < mapLength - 1) {
    if (!map[coord.x + 1][coord.y].discovered) {
      map[coord.x + 1][coord.y].discoverable++;
    }
  }

  if (coord.x > 0) {
    if (!map[coord.x - 1][coord.y].discovered) {
      map[coord.x - 1][coord.y].discoverable++;
    }
  }
}
