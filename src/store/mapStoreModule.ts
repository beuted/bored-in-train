import { Module, createNamespacedHelpers } from 'vuex';

import { Building } from '@/models/Building';
import { MapBuilder } from '../services/MapBuilder';
import { Consumable } from '../models/Consumable';
import { StaticConsumableInfo, StaticBuildingInfo } from '../services/GameEngine';
import { Environment } from '../models/Environment';
import { IMapTile } from '../models/IMapTile';
import { UtilService } from '../services/UtilService';
import { IState } from '../store';
import Vue from 'vue';
import { MessageService } from '@/services/MessageService';

export interface IMapState {
  mapNbTileFound: number,
  map: IMapTile[][],
  mapNeedsUpdate: boolean,
  buildings: IMapBuildings,
}

//TODO: remove quantity use lenght
export type IMapBuildings = { [id in Building]: { quantity: number, coords: { [xThenCommaThenY in string]: { x: number, y: number } } } }

export const MapModule: Module<IMapState, IState> = {
  state: {
    mapNbTileFound: 5,
    map: [],
    mapNeedsUpdate: true,
    buildings: {
      village: {
        quantity: 0,
        coords: {}
      },
      gathererHut: {
        quantity: 0,
        coords: {}
      },
      druidHut: {
        quantity: 0,
        coords: {}
      },
      watchTower: {
        quantity: 0,
        coords: {}
      },
      barn: {
        quantity: 0,
        coords: {}
      },
      farm: {
        quantity: 0,
        coords: {}
      },
      stoneMine: {
        quantity: 0,
        coords: {}
      },
      sawmill: {
        quantity: 0,
        coords: {}
      },
      coalMine: {
        quantity: 0,
        coords: {}
      },
      limestoneMine: {
        quantity: 0,
        coords: {}
      },
      limestoneBrickFactory: {
        quantity: 0,
        coords: {}
      },
      coalPowerStation: {
        quantity: 0,
        coords: {}
      },
      forest: {
        quantity: 0,
        coords: {}
      },
    }
  },
  actions: {
    DiscoverTile({ getters, commit, state }) { // Not used anymore
      let mapLength = state.map.length;
      let xSuite = UtilService.Shuffle<number>(UtilService.GetNumberSuite(mapLength));
      let ySuite = UtilService.Shuffle<number>(UtilService.GetNumberSuite(mapLength));
      let maxDisco = { value: 0, x: 0, y: 0 };
      let canSail = getters.canSail;
      for (const x of xSuite) {
        for (const y of ySuite) {
          let tile: IMapTile = state.map[x][y];
          if (tile.discoverable > maxDisco.value && (tile.environment != Environment.Water || canSail)) {
            maxDisco = { value: tile.discoverable, x: x, y: y };
          }
          if (maxDisco.value > 0 && Math.random() < 0.001) {
            commit('MakeTileDiscovered', { x: maxDisco.x, y: maxDisco.y });
            return;
          }
        }
      }

      if (maxDisco.value > 0) // If we have'nt found any tile discoverable, don't discover anything
        commit('MakeTileDiscovered', {x: maxDisco.x, y: maxDisco.y });
    },
  },
  mutations: {
    // Init the map
    InitMap(state: IMapState, size: number) {
      const res = MapBuilder.InitMap(size);

      state.map = res.map;
      state.buildings = res.buildings;

      state.mapNeedsUpdate = true;
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state: IMapState, obj: { x: number, y: number, type: Building | null }) {
      ChangeTile(state.map, state.buildings, obj);
      state.mapNeedsUpdate = true;
    },
    MakeTileDiscovered(state: IMapState, obj: { x: number, y: number }) {
      console.log('MakeTileDiscovered start...');
      let startTime = Date.now();

      let mapCopy = JSON.parse(JSON.stringify(state.map)); // TODO: better way to clone T[][] ?

      MakeTileDiscovered(mapCopy, obj);
      state.mapNbTileFound++;

      state.map = mapCopy;
      state.mapNeedsUpdate = true;
      console.log('MakeTileDiscovered stop, elapsed time:', Date.now() - startTime, 'ms');
    },
    MapHaveBeenUpdated(state: IMapState) {
      state.mapNeedsUpdate = false;
    },
    MapNeedsUpdate(state: IMapState) {
      state.mapNeedsUpdate = true;
    },
    ApplyMapChanges(state: IMapState) {
      let mapLength = state.map.length;
      let mapCopy = JSON.parse(JSON.stringify(state.map)) as IMapTile[][]; // TODO: better way to clone T[][] ?
      let mapNbTileFoundCopy = state.mapNbTileFound;

      for (let i = 0; i < mapLength; i++) {
        for (let j = 0; j < mapLength; j++) {
          // Add and remove Tree quantity
          if (mapCopy[i][j].building == Building.forest && mapCopy[i][j].quantity < 100) {
            mapCopy[i][j].quantity++;
          }

          if (mapCopy[i][j].building == Building.sawmill) {
            const quantityToRemove = 3 / mapCopy[i][j].closeByTrees;
            if (i > 0 && mapCopy[i-1][j].building == Building.forest)
              mapCopy[i-1][j].quantity -= quantityToRemove;
            if (j > 0 && mapCopy[i][j-1].building == Building.forest)
              mapCopy[i][j-1].quantity -= quantityToRemove;
            if (i < mapLength-1 && mapCopy[i+1][j].building == Building.forest)
              mapCopy[i+1][j].quantity -= quantityToRemove;
            if (j < mapLength-1 && mapCopy[i][j+1].building == Building.forest)
              mapCopy[i][j+1].quantity -= quantityToRemove;
          }

          // Add and remove pollution
          if (mapCopy[i][j].building == Building.forest && mapCopy[i][j].pollution > 0) {
            mapCopy[i][j].pollution--;
          } else if (mapCopy[i][j].building != null && mapCopy[i][j].pollution < 100) {
            mapCopy[i][j].pollution++;
          }

          // Discover tiles
          if (mapCopy[i][j].building == Building.watchTower) { //TODO: we might want to be able to tell when a watch tower is useless

            // Generate uniformly random coord inside circle
            const radius = 3;
            let a = Math.random() * 2 * Math.PI;
            let r = radius * Math.sqrt(Math.random());
            var iFound = i + Math.floor(r * Math.cos(a) + 0.5);
            var jFound = j + Math.floor(r * Math.sin(a) + 0.5);

            if (!mapCopy[iFound][jFound].discovered) {
              MakeTileDiscovered(mapCopy, {x: iFound, y: jFound});
              mapNbTileFoundCopy++
            }
          }
        }
      }

      for (let i = 1; i < mapLength; i++) {
        for (let j = 1; j < mapLength; j++) {
          // Spread polution
          let pollutionMedian = (mapCopy[i][j].pollution + mapCopy[i-1][j].pollution + mapCopy[i][j-1].pollution) / 3;
          mapCopy[i-1][j].pollution = pollutionMedian
          mapCopy[i][j-1].pollution = pollutionMedian
          mapCopy[i][j].pollution = pollutionMedian;

          // Remove tree if quantity hit 0
          if (mapCopy[i][j].building == Building.forest && mapCopy[i][j].quantity <= 0) {
            console.log('Forest exausted...');
            MessageService.Help('Your lumberjacks have destroyed a forest... Try to have more trees around your Sawmills to let the forests naturally regenerate.', 'forest-exausted');
            Vue.toasted.error(`Your lumberjacks have destroyed a forest`);
            ChangeTile(mapCopy, state.buildings, {x: i, y: j, type: null});
            mapCopy[i][j].quantity = 0;
          }
        }
      }

      state.mapNbTileFound = mapNbTileFoundCopy++;
      state.map = mapCopy;
      state.mapNeedsUpdate = true;
    }
  },
  getters: {
    getRessourceStorage(state): (id: Consumable) => number {
      return (id: Consumable) => {
        var storage = StaticConsumableInfo[id].storage;
        if (storage === undefined)
          return -1;

        return state.buildings[storage.name].quantity * storage.capacity;
      }
    },
  }
}

function updateCloseByTreeAndSawmill(pos: {x: number, y: number}, map: IMapTile[][], buildings: IMapBuildings, increment: number) {
  map[pos.x][pos.y].closeByTrees += increment;
  if (map[pos.x][pos.y].building == Building.sawmill && map[pos.x][pos.y].closeByTrees <= 0) {
    delete buildings[Building.sawmill].coords[pos.x+','+pos.y];
    buildings[Building.sawmill].quantity--;
    // We do not remove the building from state.map so that it still appear on the map

    map[pos.x][pos.y].population = 0;
    map[pos.x][pos.y].disabled = true;

    Vue.toasted.error('A sawmill stopped working due to a lack of forest nearby');
  } else if (map[pos.x][pos.y].building == Building.sawmill && map[pos.x][pos.y].closeByTrees > 0 && !buildings[Building.sawmill].coords[pos.x+','+pos.y]) {
    // Once a tree is planted we might reactivate the sawmills next to it
    buildings[Building.sawmill].coords[pos.x+','+pos.y] = { x: pos.x, y: pos.y };
    buildings[Building.sawmill].quantity++;
    delete map[pos.x][pos.y].disabled;

    Vue.toasted.success('Your sawmill started working again thanks to the new forest');
  }
}

function UpdateNbTreeNearBy(pos: {x: number, y: number}, map: IMapTile[][], buildings: IMapBuildings, increment: number) {
  if (pos.x > 0)
    updateCloseByTreeAndSawmill({x: pos.x-1, y: pos.y}, map, buildings, increment);

  if (pos.x < map.length-1)
    updateCloseByTreeAndSawmill({x: pos.x+1, y: pos.y}, map, buildings, increment);

  if (pos.y > 0)
    updateCloseByTreeAndSawmill({x: pos.x, y: pos.y-1}, map, buildings, increment);

  if (pos.y < map.length-1)
    updateCloseByTreeAndSawmill({x: pos.x, y: pos.y+1}, map, buildings, increment);
}

function ChangeTile(map: IMapTile[][], buildings: IMapBuildings, obj: { x: number, y: number, type: Building | null }) {
  var previousTile = map[obj.x][obj.y];

  console.debug(`Changing tile ${obj.x}, ${obj.y} from ${previousTile.building} to ${obj.type}`);

  if (previousTile.building != null && !previousTile.disabled) {
    buildings[previousTile.building].quantity--;
    delete buildings[previousTile.building].coords[obj.x + ',' + obj.y];
  }

  // We need to update nbTreeNearby if a forest is added or deleted
  if (previousTile.building == Building.forest || obj.type == Building.forest) {
    let increment = (obj.type == Building.forest ? 1 : 0) - (previousTile.building == Building.forest ? 1 : 0)
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
    buildings[obj.type].coords[obj.x + ',' + obj.y] = { x: obj.x, y: obj.y };
  }
}

function MakeTileDiscovered(map: IMapTile[][], coord: { x: number, y: number }) {
  map[coord.x][coord.y].discovered = true;
  map[coord.x][coord.y].discoverable = 0;

  let mapLength = map.length;
  if (coord.y < mapLength-1) {
    if (!map[coord.x][coord.y+1].discovered) {
      map[coord.x][coord.y+1].discoverable++;
    }
  }

  if (coord.y > 0) {
    if (!map[coord.x][coord.y-1].discovered) {
      map[coord.x][coord.y-1].discoverable++;
    }
  }

  if (coord.x < mapLength-1) {
    if (!map[coord.x+1][coord.y].discovered) {
      map[coord.x+1][coord.y].discoverable++;
    }
  }

  if (coord.x > 0) {
    if (!map[coord.x-1][coord.y].discovered) {
      map[coord.x-1][coord.y].discoverable++;
    }
  }
}