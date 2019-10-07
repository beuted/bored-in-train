import { Module } from 'vuex';

import { Building } from '@/models/Building';
import { MapBuilder } from '../services/MapBuilder';
import { Consummable } from '../models/Consummable';
import { StaticConsummableInfo } from '../services/GameEngine';
import { Environment } from '../models/Environment';
import { IMapTile } from '../models/IMapTile';
import { UtilService } from '../services/UtilService';
import { IState } from '../store';

export interface IMapState {
  mapNbTileFound: number,
  map: IMapTile[][],
  mapNeedsUpdate: boolean,
  buildings: { [id in Building]: { quantity: number } },
}

export const MapModule: Module<IMapState, IState> = {
  state: {
    mapNbTileFound: 5,
    map: [],
    mapNeedsUpdate: true,
    buildings: {
      village: {
        quantity: 1,
      },
      barn: {
        quantity: 1,
      },
      farm: {
        quantity: 0,
      },
      stoneMine: {
        quantity: 0
      },
      coalMine: {
        quantity: 0,
      },
      limestoneMine: {
        quantity: 0
      },
      limestoneBrickFactory: {
        quantity: 0
      },
      coalPowerStation: {
        quantity: 0,
      },
      forest: {
        quantity: 30, //TODO: Put real value here retreived from MapBuilder
      },

    },
  },
  actions: {
    DiscoverTile({ getters, commit, state }) {
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

      commit('MakeTileDiscovered', {x: maxDisco.x, y: maxDisco.y });
    },
  },
  mutations: {
    // Init the map
    InitMap(state: IMapState, size: number) {
      state.map = MapBuilder.InitMap(size);

      state.mapNeedsUpdate = true;
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state: IMapState, obj: { x: number, y: number, type: Building }) {
      var previousTile = state.map[obj.x][obj.y];

      console.debug(`Changing tile ${obj.x}, ${obj.y} from ${previousTile.building} to ${obj.type}`);

      if (previousTile.building != null) {
        state.buildings[previousTile.building].quantity--;
      }

      state.map[obj.x][obj.y].building = obj.type;

      if (obj.type != null) {
        state.buildings[obj.type].quantity++;
      }

      state.mapNeedsUpdate = true;
    },
    MakeTileDiscovered(state: IMapState, obj: { x: number, y: number }) {
      console.log('MakeTileDiscovered start...');
      let startTime = Date.now();

      let mapCopy = JSON.parse(JSON.stringify(state.map)); // TODO: better way to clone T[][] ?

      mapCopy[obj.x][obj.y].discovered = true;
      mapCopy[obj.x][obj.y].discoverable = 0;
      state.mapNbTileFound++;

      let mapLength = mapCopy.length;
      if (obj.y < mapLength-1) {
        if (!mapCopy[obj.x][obj.y+1].discovered) {
          mapCopy[obj.x][obj.y+1].discoverable++;
        }
      }

      if (obj.y > 0) {
        if (!mapCopy[obj.x][obj.y-1].discovered) {
          mapCopy[obj.x][obj.y-1].discoverable++;
        }
      }

      if (obj.x < mapLength-1) {
        if (!mapCopy[obj.x+1][obj.y].discovered) {
          mapCopy[obj.x+1][obj.y].discoverable++;
        }
      }

      if (obj.x > 0) {
        if (!mapCopy[obj.x-1][obj.y].discovered) {
          mapCopy[obj.x-1][obj.y].discoverable++;
        }
      }

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
    ApplyPollution(state: IMapState) {
      let mapLength = state.map.length;
      let mapCopy = JSON.parse(JSON.stringify(state.map)); // TODO: better way to clone T[][] ?
      for (let i = 0; i < mapLength; i++) {
        for (let j = 0; j < mapLength; j++) {
          if (mapCopy[i][j].building == Building.forest && mapCopy[i][j].pollution > 0) {
            mapCopy[i][j].pollution--;
          } else if (mapCopy[i][j].building != null && mapCopy[i][j].pollution < 100) {
            mapCopy[i][j].pollution++;
          }
        }
      }
      for (let i = 1; i < mapLength; i++) {
        for (let j = 1; j < mapLength; j++) {
          let pollutionMedian = (mapCopy[i][j].pollution + mapCopy[i-1][j].pollution + mapCopy[i][j-1].pollution) / 3;
          mapCopy[i-1][j].pollution = pollutionMedian
          mapCopy[i][j-1].pollution = pollutionMedian
          mapCopy[i][j].pollution = pollutionMedian;
        }
      }

      state.map = mapCopy;
      state.mapNeedsUpdate = true;
    }
  },
  getters: {
    getRessourceStorage(state): (id: Consummable) => number {
      return (id: Consummable) => {
        var storage = StaticConsummableInfo[id].storage;
        if (storage === undefined)
          return -1;

        return state.buildings[storage.name].quantity * storage.capacity;
      }
    },
  }
}