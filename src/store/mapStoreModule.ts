import { Module } from 'vuex';

import { Building, BuildingToStorageMapping } from '@/models/Building';
import { MapBuilder } from '../services/MapBuilder';
import { Consummable } from '../models/Consummable';
import { Storage } from '@/models/Storage';
import { StaticConsummableInfo } from '../services/GameEngine';
import { Environment } from '../models/Environment';
import { IMapTile } from '../models/IMapTile';
import { UtilService } from '../services/UtilService';
import { IState } from '../store';

export interface IMapState {
  mapNbTileFound: number,
  map: IMapTile[][],
  storage: { [id in Storage]: { quantity: number } },
}

export const MapModule: Module<IMapState, IState> = {
  state: {
    mapNbTileFound: 5,
    map: [],
    storage: {
      villages: {
        quantity: 1,
      },
      barns: {
        quantity: 1,
      },
      farms: {
        quantity: 0,
      },
      coalMines: {
        quantity: 0,
      },
      coalPowerStations: {
        quantity: 0,
      },
    },
  },
  mutations: {
    // Init the map
    InitMap(state: IMapState, size: number) {
      state.map = MapBuilder.InitMap(size);
    },
    // Change a tile of a map giving it a certain type
    ChangeTile(state: IMapState, obj: { x: number, y: number, type: Building }) {
      var previousTile = state.map[obj.x][obj.y];

      console.debug(`Changing tile ${obj.x}, ${obj.y} from ${previousTile.building} to ${obj.type}`);

      let storageTypeToDestroy = (BuildingToStorageMapping as any)[previousTile.building]
      if (storageTypeToDestroy != null) {
        (state.storage as any)[storageTypeToDestroy].quantity--;
      }

      state.map[obj.x][obj.y].building = obj.type;
      state.map[obj.x][obj.y].environment = Environment.Field;

      let storageTypeToBuild = (BuildingToStorageMapping as any)[obj.type]
      if (storageTypeToBuild != null) {
        (state.storage as any)[storageTypeToBuild].quantity++;
      }
    },
    DiscoverTile(state: IMapState) {
      var xSuite = UtilService.Shuffle<number>(UtilService.GetNumberSuite(state.map.length));
      var ySuite = UtilService.Shuffle<number>(UtilService.GetNumberSuite(state.map.length));
      for (const x of xSuite) {
        for (const y of ySuite) {
          if (!state.map[x][y].discovered && (
            (state.map[x][y+1] && state.map[x][y+1].discovered) ||
            (state.map[x][y-1] && state.map[x][y-1].discovered) ||
            (state.map[x+1] && state.map[x+1][y] && state.map[x+1][y].discovered) ||
            (state.map[x-1] && state.map[x-1][y] && state.map[x-1][y].discovered))) {
              state.map[x][y].discovered = true;
              state.mapNbTileFound++;
              return;
            }
        }
      }
      console.error('DiscoverTile: No tile left to discover!')
    },
  },
  getters: {
    getRessourceStorage(state): (id: Consummable) => number {
      return (id: Consummable) => {
        var storage = StaticConsummableInfo[id].storage;
        if (storage === undefined)
          return -1;

        return state.storage[storage.name].quantity * storage.capacity;
      }
    },
    tiles(state): IMapTile[][] {
        return state.map.map((x, i) => x.map((y, j) => {
          if (!state.map[i] || !state.map[i][j])
            return { building : Building.NoBuilding, environment: Environment.Field, discovered: false };
          return state.map[i][j];
        }));
    },
    tilesDiscoverability(state) {
      return state.map.map((x, i) => x.map((y, j) => {
        return !state.map[i][j].discovered && (
          (state.map[i][j+1] && state.map[i][j+1].discovered) ||
          (state.map[i][j-1] && state.map[i][j-1].discovered) ||
          (state.map[i+1] && state.map[i+1][j] && state.map[i+1][j].discovered) ||
          (state.map[i-1] && state.map[i-1][j] && state.map[i-1][j].discovered)
        )
      }));
    },
  }
}