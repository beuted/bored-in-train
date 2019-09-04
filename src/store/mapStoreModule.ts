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
  buildings: { [id in Building]: { quantity: number } },
}

export const MapModule: Module<IMapState, IState> = {
  state: {
    mapNbTileFound: 5,
    map: [],
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
    DiscoverTile({ getters, commit }) {
      console.log('DiscoverTile start...');
      let startTime = Date.now();
      let tilesDiscoverability = getters.tilesDiscoverability;
      let xSuite = UtilService.Shuffle<number>(UtilService.GetNumberSuite(tilesDiscoverability.length));
      let ySuite = UtilService.Shuffle<number>(UtilService.GetNumberSuite(tilesDiscoverability.length));
      let maxDisco = { value: 0, x: 0, y: 0 };
      for (const x of xSuite) {
        for (const y of ySuite) {
          const tilesDisco = tilesDiscoverability[x][y];
          const tile = getters.tiles[x][y];
          if (tilesDisco > maxDisco.value && (tile.environment != Environment.Water || getters.canSail)) {
            maxDisco = { value: tilesDisco, x: x, y: y };
          }
          if (maxDisco.value > 0 && Math.random() < 0.001) {
            commit('MakeTileDiscovered', { x: maxDisco.x, y: maxDisco.y });
            console.log('DiscoverTile stop early, elapsed time:', Date.now() - startTime, 'ms');
            return;
          }
        }
      }

      commit('MakeTileDiscovered', {x: maxDisco.x, y: maxDisco.y });
      console.log('DiscoverTile stop, elapsed time:', Date.now() - startTime, 'ms');
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

      if (previousTile.building != null) {
        state.buildings[previousTile.building].quantity--;
      }

      state.map[obj.x][obj.y].building = obj.type;

      if (obj.type != null) {
        state.buildings[obj.type].quantity++;
      }
    },
    MakeTileDiscovered(state: IMapState, obj: { x: number, y: number }) {
      state.map[obj.x][obj.y].discovered = true;
      state.mapNbTileFound++;
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
    tiles(state): IMapTile[][] {
        return state.map.map((x, i) => x.map((y, j) => {
          if (!state.map[i] || !state.map[i][j])
            return { building : null, environment: Environment.Field, discovered: false };
          return state.map[i][j];
        }));
    },
    //TODO: this should not be recomputed entirely, only one cell needs to be recomputed in fact
    tilesDiscoverability(state) {
      console.log('tilesDiscoverability start...');
      var startTime = Date.now();
      const mapLength = state.map.length;
      let result = new Array(mapLength);
      for (let i=0; i < mapLength; i++) {
        // Efficient way to fill an array with 0
        (result[i] = []).length = mapLength; result[i].fill(0);
      }

      /*for (let i=0; i < mapLength; i++) {
        for (let j=0; j < mapLength; j++) {
          if (state.map[i][j].discovered) {
            if (j < mapLength -1 && state.map[i][j+1].discovered !== true) result[i][j+1]++;
            if (j > 0 && state.map[i][j-1].discovered !== true) result[i][j-1]++;
            if (i < mapLength -1 && state.map[i+1][j].discovered !== true) result[i+1][j]++;
            if (i > 0 && state.map[i-1][j].discovered !== true) result[i-1][j]++;
          }
        }
      }*/

      // Kind of Floodfill algo
      const center = Math.floor(mapLength/2);
      let originCell = { x: center, y: center, tile: state.map[center][center] };
      let cells: { x: number, y: number, tile: IMapTile }[] = [originCell];
      var visitedCells: Set<string> = new Set([getCellHash(originCell)]);
      var discoverableCells: { [id: string]: number } = {};

      let cell = cells.shift();
      while (cell !== undefined) {
        if (!cell.tile.discovered) {
          if (discoverableCells.hasOwnProperty(getCellHash(cell))) {
            discoverableCells[getCellHash(cell)]++;
          } else {
            discoverableCells[getCellHash(cell)] = 1;
          }
        } else {
          //TODO: les +1 -1 ca va faire chier
          if (cell.y < mapLength-1) {
            var rightCell = { x: cell.x, y: cell.y+1, tile: state.map[cell.x][cell.y+1] };
            if (!visitedCells.has(getCellHash(rightCell))) {
              cells.push(rightCell);
              visitedCells.add(getCellHash(rightCell));
            }
          }

          if (cell.y > 0) {
            var leftCell = { x: cell.x, y: cell.y-1, tile: state.map[cell.x][cell.y-1] };
            if (!visitedCells.has(getCellHash(leftCell))) {
              cells.push(leftCell);
              visitedCells.add(getCellHash(leftCell));
            }
          }

          if (cell.x < mapLength-1) {
            var bottomCell = { x: cell.x+1, y: cell.y, tile: state.map[cell.x+1][cell.y] };
            if (!visitedCells.has(getCellHash(bottomCell))) {
              cells.push(bottomCell);
              visitedCells.add(getCellHash(bottomCell));
            }
          }

          if (cell.x > 0) {
            var topCell = { x: cell.x-1, y: cell.y, tile: state.map[cell.x-1][cell.y] };
            if (!visitedCells.has(getCellHash(topCell))) {
              cells.push(topCell);
              visitedCells.add(getCellHash(topCell));
            }
          }
        }

        cell = cells.shift();
      }

      console.log('tilesDiscoverability stop, elapsed time:', Date.now() - startTime, 'ms');
      return discoverableCells;

      function getCellHash(pos: { x: number, y: number }) {
        return pos.x + ',' + pos.y;
      }
    },
  }
}