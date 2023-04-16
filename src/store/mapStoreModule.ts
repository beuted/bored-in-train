import { Module } from "vuex";

import { Building } from "@/models/Building";
import { MapBuilder } from "../services/MapBuilder";
import { Consumable } from "../models/Consumable";
import {
  StaticConsumableInfo,
  StaticBuildingInfo,
  IStaticBuilding,
  IStaticBuildingProduction,
  IStaticConsumable,
} from "../services/GameEngine";
import { Environment } from "../models/Environment";
import { IMapTile } from "../models/IMapTile";
import { IState } from "../store";
import store from "@/store";
import Vue from "vue";
import { MessageService } from "@/services/MessageService";
import { EventBus } from "@/EventBus";

export const MapSize = 100;
export interface IMapState {
  mapNbTileFound: number;
  map: IMapTile[][];
  mapSize: number;
  mapNeedsUpdate: boolean;
  buildings: IMapBuildings;
}

export type IMapBuildings = {
  [id in Building]: {
    quantity: number; // TODO: use less now ?
    coords: { [xThenCommaThenY in string]: { x: number; y: number } };
  };
};

const watchTowerOrderOfDiscovery = [
  [{ i: 0, j: 0 }],
  [
    { i: 0, j: 1 },
    { i: 1, j: 0 },
    { i: 0, j: -1 },
    { i: -1, j: 0 },
  ], // radius 0.1
  [
    { i: 1, j: 1 },
    { i: 1, j: -1 },
    { i: -1, j: -1 },
    { i: -1, j: 1 },
  ], // radius 1
  [
    { i: 0, j: 2 },
    { i: 0, j: -2 },
    { i: 2, j: 0 },
    { i: -2, j: 0 },
  ], // radius 2 (pas vraiment un cercle)
  [
    { i: 1, j: 2 },
    { i: 1, j: -2 },
    { i: 2, j: 1 },
    { i: 2, j: -1 },
    { i: -1, j: 2 },
    { i: -1, j: -2 },
    { i: -2, j: 1 },
    { i: -2, j: -1 },
  ], // radius 2.1
  [
    { i: 0, j: 3 },
    { i: 0, j: -3 },
    { i: 2, j: 2 },
    { i: 2, j: 3 },
    { i: 2, j: -2 },
    { i: 2, j: -3 },
    { i: 3, j: 0 },
    { i: 3, j: 1 },
    { i: 3, j: 2 },
    { i: 3, j: -2 },
    { i: -2, j: 2 },
    { i: -2, j: 3 },
    { i: -2, j: -2 },
    { i: -2, j: -3 },
    { i: -3, j: 0 },
    { i: -3, j: 2 },
    { i: -3, j: -2 },
  ], // radius 2.9 (pas vraiment un cercle)
  [
    { i: 1, j: 3 },
    { i: 1, j: -3 },
    { i: 3, j: 1 },
    { i: 3, j: -1 },
    { i: -1, j: 3 },
    { i: -1, j: -3 },
    { i: -3, j: 1 },
    { i: -3, j: -1 },
  ], // radius 3
];
/*const radius = 4;
let res = [];
for (var i = 0; i < 10000; i++) {
    let a = Math.random() * 2 * Math.PI;
    var iFound = Math.floor(radius * Math.cos(a) + 0.5);
    var jFound = Math.floor(radius * Math.sin(a) + 0.5);
    if (!res[iFound + ','+ jFound])
        res[iFound + ','+ jFound] = {i: iFound, j: jFound};
}
console.log(JSON.stringify(Object.values(res))) */

const stoneWatchTowerOrderOfDiscovery = watchTowerOrderOfDiscovery.concat([
  [
    { i: 1, j: 4 },
    { i: 0, j: -4 },
    { i: 4, j: 2 },
    { i: 4, j: 1 },
    { i: -1, j: -4 },
    { i: 0, j: 4 },
    { i: 4, j: 0 },
    { i: -4, j: 0 },
    { i: -4, j: 1 },
    { i: 3, j: 3 },
    { i: -4, j: 2 },
    { i: -4, j: -1 },
    { i: -4, j: -2 },
    { i: -1, j: 4 },
    { i: 4, j: -1 },
    { i: 2, j: 4 },
    { i: -3, j: 3 },
    { i: 4, j: -2 },
    { i: -2, j: 4 },
    { i: -3, j: -3 },
    { i: 1, j: -4 },
    { i: -2, j: -4 },
    { i: 3, j: -3 },
    { i: 2, j: -4 },
  ],
  [
    { i: 5, j: 0 },
    { i: 3, j: -4 },
    { i: -2, j: 5 },
    { i: 0, j: 5 },
    { i: 5, j: 1 },
    { i: -3, j: 4 },
    { i: 5, j: -2 },
    { i: 4, j: 3 },
    { i: 3, j: 4 },
    { i: 2, j: -5 },
    { i: -4, j: 3 },
    { i: -3, j: -4 },
    { i: -4, j: -3 },
    { i: -4, j: -4 },
    { i: -5, j: 0 },
    { i: 4, j: -4 },
    { i: 1, j: 5 },
    { i: -1, j: 5 },
    { i: -5, j: 1 },
    { i: 4, j: -3 },
    { i: -1, j: -5 },
    { i: 0, j: -5 },
    { i: 5, j: 2 },
    { i: -5, j: 2 },
    { i: -5, j: -2 },
    { i: 2, j: 5 },
    { i: 1, j: -5 },
    { i: -5, j: -1 },
    { i: 5, j: -1 },
    { i: -2, j: -5 },
    { i: 4, j: 4 },
    { i: -4, j: 4 },
  ],
]);

const castleOrderOfDiscovery = stoneWatchTowerOrderOfDiscovery.concat([
  [
    { i: 2, j: -6 },
    { i: 6, j: -2 },
    { i: -6, j: 1 },
    { i: -3, j: 5 },
    { i: -6, j: -2 },
    { i: 6, j: 2 },
    { i: -5, j: 3 },
    { i: -6, j: 2 },
    { i: -4, j: -5 },
    { i: 0, j: -6 },
    { i: 6, j: 0 },
    { i: 5, j: 3 },
    { i: 0, j: 6 },
    { i: 5, j: -4 },
    { i: -5, j: 4 },
    { i: 4, j: 5 },
    { i: -2, j: 6 },
    { i: -1, j: 6 },
    { i: 6, j: -1 },
    { i: -6, j: -1 },
    { i: 6, j: 1 },
    { i: -3, j: -5 },
    { i: -4, j: 5 },
    { i: 5, j: -3 },
    { i: -5, j: -4 },
    { i: 1, j: 6 },
    { i: 3, j: 5 },
    { i: -1, j: -6 },
    { i: 3, j: -5 },
    { i: -5, j: -3 },
    { i: -2, j: -6 },
    { i: 2, j: 6 },
    { i: -6, j: 0 },
    { i: 1, j: -6 },
    { i: 5, j: 4 },
    { i: 4, j: -5 },
  ],
  [
    { i: -6, j: -4 },
    { i: 6, j: -3 },
    { i: -1, j: -7 },
    { i: -5, j: -5 },
    { i: 5, j: -5 },
    { i: 6, j: 4 },
    { i: 7, j: 1 },
    { i: -7, j: 0 },
    { i: 0, j: 7 },
    { i: 6, j: -4 },
    { i: -4, j: -6 },
    { i: -2, j: -7 },
    { i: 3, j: 6 },
    { i: 7, j: -2 },
    { i: -7, j: 3 },
    { i: 0, j: -7 },
    { i: 4, j: 6 },
    { i: 7, j: -1 },
    { i: 5, j: 5 },
    { i: -6, j: 4 },
    { i: 1, j: -7 },
    { i: -1, j: 7 },
    { i: -3, j: -6 },
    { i: -6, j: -3 },
    { i: 6, j: 3 },
    { i: 4, j: -6 },
    { i: -5, j: 5 },
    { i: 1, j: 7 },
    { i: -7, j: 1 },
    { i: -4, j: 6 },
    { i: -2, j: 7 },
    { i: -3, j: -7 },
    { i: 3, j: 7 },
    { i: 2, j: -7 },
    { i: -7, j: -1 },
    { i: -7, j: -3 },
    { i: 7, j: 2 },
    { i: -3, j: 6 },
    { i: -7, j: -2 },
    { i: -7, j: 2 },
    { i: -6, j: 3 },
    { i: 7, j: 0 },
    { i: 3, j: -6 },
    { i: 7, j: -3 },
    { i: 2, j: 7 },
    { i: -3, j: 7 },
    { i: 7, j: 3 },
    { i: 3, j: -7 },
  ],
]);

export const sawmillRadius = 2;
export const MaxRadius = 4;

export function getTilesForCircle(
  center: { x: number; y: number },
  radius: number,
  excludeCenter = false
) {
  var res: { x: number; y: number }[] = excludeCenter ? [] : [center];
  for (let i = 1; i <= 9; i++) {
    if (radius >= i) {
      res = res.concat(
        castleOrderOfDiscovery[i].map((tile) => ({
          x: tile.i + center.x,
          y: tile.j + center.y,
        }))
      );
    }
  }
  return res.filter(
    (tile) =>
      tile.x > 0 && tile.y > 0 && tile.x < MapSize - 1 && tile.y < MapSize - 1
  );
}

function GetInitialBuildingState() {
  return Object.keys(StaticBuildingInfo).reduce<Partial<IMapBuildings>>(
    (accumulator, building) => {
      accumulator[building as Building] = { quantity: 0, coords: {} };
      return accumulator;
    },
    {}
  ) as IMapBuildings;
}

export const MapModule: Module<IMapState, IState> = {
  state: {
    mapNbTileFound: 5,
    map: [],
    mapSize: 42,
    mapNeedsUpdate: true,
    buildings: GetInitialBuildingState(),
  },
  actions: {},
  mutations: {
    // Init the map
    InitMap(state: IMapState, size: number) {
      const res = MapBuilder.InitMap(size);

      state.map = res.map;
      state.mapSize = res.mapSize;
      state.buildings = res.buildings;

      // Build buildings
      var center = Math.floor(size / 2);
      ChangeTile(state.map, state.buildings, {
        x: center,
        y: center,
        type: Building.watchTower,
      });

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
    ApplyMapChanges(state: IMapState) {
      let mapNbTileFoundCopy = state.mapNbTileFound;

      for (let building of [
        Building.watchTower,
        Building.stoneWatchTower,
        Building.lighthouse,
        Building.castle,
      ]) {
        for (let coord of Object.values(state.buildings[building].coords)) {
          const i = coord.x;
          const j = coord.y;

          let orderOfDiscovery: { i: number; j: number }[][];
          if (state.map[i][j].b == Building.stoneWatchTower)
            orderOfDiscovery = stoneWatchTowerOrderOfDiscovery;
          else if (state.map[i][j].b == Building.castle)
            orderOfDiscovery = castleOrderOfDiscovery;
          else orderOfDiscovery = watchTowerOrderOfDiscovery;

          let TileDiscovered = false;
          for (let possibleTiles of orderOfDiscovery) {
            for (let possibleTile of possibleTiles) {
              // TODO: order not random ?
              if (
                i + possibleTile.i < 0 ||
                j + possibleTile.j < 0 ||
                i + possibleTile.i >= state.mapSize ||
                j + possibleTile.j >= state.mapSize ||
                state.map[i + possibleTile.i][j + possibleTile.j].discovered ||
                (state.map[i + possibleTile.i][j + possibleTile.j].e ==
                  Environment.Water &&
                  state.map[i][j].b != Building.lighthouse)
              )
                continue;
              MakeTileDiscovered(state.map, {
                x: i + possibleTile.i,
                y: j + possibleTile.j,
              });
              mapNbTileFoundCopy++;
              TileDiscovered = true;
              break;
            }
            if (TileDiscovered) break;
          }
        }
      }

      state.mapNbTileFound = mapNbTileFoundCopy++;
      state.mapNeedsUpdate = true;
    },
  },
  getters: {
    getRessourceStorage(state): (id: Consumable) => number {
      return (id: Consumable) => {
        var storage = StaticConsumableInfo[id].storage;
        if (storage === undefined) return -1;

        return state.buildings[storage.name].quantity * storage.capacity + 50;
      };
    },
  },
};

function ChangeTile(
  map: IMapTile[][],
  buildings: IMapBuildings,
  obj: { x: number; y: number; type: Building | null }
) {
  var previousTile = map[obj.x][obj.y];

  let staticBuilding: IStaticBuilding =
    StaticBuildingInfo[obj.type as Building]; //TODO: fix typeing weirdlness

  // Transformations
  let transformTo: Building | null = obj.type;
  for (let transformation of staticBuilding.transformations) {
    // Here ordered by priorities
    if (transformation.nextToBuilding != null) {
      let neighbourTiles = getTilesForCircle(obj, 1, true);
      for (let tile of neighbourTiles) {
        if (map[tile.x][tile.y].b == transformation.nextToBuilding) {
          transformTo = transformation.to;
          break;
        }
      }
      if (transformTo != obj.type) break;
    } else if (transformation.nextToEnvironment != null) {
      let neighbourTiles = getTilesForCircle(obj, 1, true);
      for (let tile of neighbourTiles) {
        if (map[tile.x][tile.y].e == transformation.nextToEnvironment) {
          transformTo = transformation.to;
          break;
        }
      }
    } else if (transformation.onEnvironment != null) {
      if (map[obj.x][obj.y].e == transformation.onEnvironment) {
        transformTo = transformation.to;
        break;
      }
    }
  }

  // Transformations with building pattern of own tile
  for (let transformation of staticBuilding.transformations) {
    // TODO deal with neighbourTransformation.nextToBuilding
    if (!transformation.buildingPattern) continue;

    let tilesToCheck = getTilesForCircle(
      obj,
      transformation.buildingPattern.distance,
      true
    );

    let missingBuilding = false;
    for (let tileToCheck of tilesToCheck) {
      if (
        map[tileToCheck.x][tileToCheck.y].b !=
        transformation.buildingPattern.building
      ) {
        missingBuilding = true;
        break;
      }
    }
    if (missingBuilding) continue;

    transformTo = transformation.to;
    break;
  }

  // Transformations with building pattern of other tiles
  let tiles = getTilesForCircle(obj, MaxRadius, true);
  for (let neighbourTile of tiles) {
    let neighbourBuilding = map[neighbourTile.x][neighbourTile.y].b;
    if (!neighbourBuilding) continue;

    let neighbourStaticBuilding: IStaticBuilding =
      StaticBuildingInfo[neighbourBuilding];
    for (let neighbourTransformation of neighbourStaticBuilding.transformations) {
      // TODO deal with neighbourTransformation.nextToBuilding
      if (
        !neighbourTransformation.buildingPattern ||
        neighbourTransformation.buildingPattern.building != transformTo
      )
        continue;

      let tilesToCheck = getTilesForCircle(
        neighbourTile,
        neighbourTransformation.buildingPattern.distance,
        true
      );

      if (tilesToCheck.findIndex((t) => t.x == obj.x && t.y == obj.y) == -1) {
        continue;
      }

      let nbBuildings = 0;
      let missingBuildingCoord: { x: number; y: number } | null = null;
      for (let tileToCheck of tilesToCheck) {
        if (
          map[tileToCheck.x][tileToCheck.y].b !=
          neighbourTransformation.buildingPattern.building
        ) {
          missingBuildingCoord = tileToCheck;
          nbBuildings++;
        }
        if (nbBuildings > 2) break;
      }

      if (
        nbBuildings == 1 &&
        missingBuildingCoord &&
        missingBuildingCoord.x == obj.x &&
        missingBuildingCoord.y == obj.y
      ) {
        ChangeTile(map, buildings, {
          x: neighbourTile.x,
          y: neighbourTile.y,
          type: neighbourTransformation.to,
        });
        break;
      }
    }
  }

  staticBuilding = StaticBuildingInfo[transformTo as Building]; //TODO: fix typeing weirdlness

  store.commit("AddKnownBuilding", {
    building: transformTo,
  });

  if (transformTo == Building.rocketSilo) {
    store.commit("WonTheGame", { value: true });
  }

  console.debug(
    `Changing tile ${obj.x}, ${obj.y} from ${previousTile.b} to ${transformTo}`
  );

  map[obj.x][obj.y].b = transformTo;
  map[obj.x][obj.y].q = 0;

  // If we're building a tree update the quantity
  if (transformTo == Building.forest) {
    map[obj.x][obj.y].q = 20;
  }

  if (transformTo != null) {
    buildings[transformTo].quantity++;
    buildings[transformTo].coords[obj.x + "," + obj.y] = { x: obj.x, y: obj.y };
  }

  ///////////////////
  // Production
  let newConsumables = JSON.parse(JSON.stringify(store.state.consumable)); // TODO: Dirty deepcopy because Object.assign isn't enough

  for (let consumableId in staticBuilding.produce) {
    let staticBuildingProduction: IStaticBuildingProduction | undefined =
      staticBuilding.produce[consumableId as Consumable];
    if (staticBuildingProduction == null) continue;

    newConsumables[consumableId as Consumable].quantity +=
      staticBuildingProduction.quantity;
    store.state.consumable[consumableId as Consumable].isKnown = true;

    var neighbourTiles = getTilesForCircle(obj, sawmillRadius, true);

    // Bonus production based on buildings
    if (staticBuildingProduction.bonusesForAdjacentBuilding) {
      for (let bonusForBuilding of staticBuildingProduction.bonusesForAdjacentBuilding) {
        for (const tile of neighbourTiles) {
          if (map[tile.x][tile.y].b == bonusForBuilding.for) {
            newConsumables[consumableId as Consumable].quantity +=
              bonusForBuilding.quantity;
          }
        }
      }
    }

    // Bonus production based on Environment
    if (staticBuildingProduction.bonusesForAdjacentEnvironment) {
      for (let bonusForBuilding of staticBuildingProduction.bonusesForAdjacentEnvironment) {
        for (const tile of neighbourTiles) {
          if (map[tile.x][tile.y].e == bonusForBuilding.for) {
            newConsumables[consumableId as Consumable].quantity +=
              bonusForBuilding.quantity;
          }
        }
      }
    }

    neighbourTiles.push({ x: obj.x, y: obj.y });
  }

  for (let consumableId in staticBuilding.consume) {
    let staticJobConsumption: IStaticBuildingProduction | undefined =
      staticBuilding.consume[consumableId as Consumable];
    if (staticJobConsumption == null) continue;

    newConsumables[consumableId as Consumable].quantity -=
      staticJobConsumption.quantity;
  }

  // After operation checks (storage, ...)
  for (let consumableId in StaticConsumableInfo) {
    let staticConsumable: IStaticConsumable =
      StaticConsumableInfo[consumableId as Consumable]; //TODO: fix typeing weirdlness
    // See if storage fits
    if (
      staticConsumable.storage &&
      staticConsumable.storage.capacity *
        store.state.map.buildings[staticConsumable.storage.name].quantity +
        50 <
        newConsumables[consumableId as Consumable].quantity
    ) {
      let quantityToRemove =
        newConsumables[consumableId as Consumable].quantity -
        (store.state.map.buildings[staticConsumable.storage.name].quantity *
          staticConsumable.storage.capacity +
          50);
      newConsumables[consumableId as Consumable].quantity -= quantityToRemove;

      // Show help messages
      if ((consumableId as Consumable) == Consumable.population) {
        MessageService.Help(
          `You have reached your max population, build more villages to welcome more people.`,
          "max-pop-reached"
        );
      } else {
        MessageService.Help(
          `You cannot store the ${consumableId} you produced, it has been destroyed.`,
          "max-consumable-reached"
        );
      }
    }
  }

  let production = getProductionDiff(newConsumables, store.state.consumable);

  store.commit("IncrementConsumables", production);
  EventBus.$emit("consumable-production", production);
}

function getProductionDiff(
  newConsumables: { [id in Consumable]: { quantity: number } },
  oldConsumables: { [id in Consumable]: { quantity: number } }
) {
  let production = <{ [id in Consumable]: number }>{};

  for (let consumableId in StaticConsumableInfo) {
    production[consumableId as Consumable] =
      newConsumables[consumableId as Consumable].quantity -
      oldConsumables[consumableId as Consumable].quantity;
  }

  return production;
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
