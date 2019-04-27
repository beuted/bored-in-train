import { Consummable } from '@/models/Consummable';
import { Job } from '@/models/Job';
import { Storage } from '@/models/Storage';

export type IStaticConsummableInfo = {[id in Consummable]: IStaticConsummable}
export type IStaticStorageInfo = {[id in Storage]: IStaticStorage}

export interface IStaticConsummable {
  storage: IStorage | undefined;
}

export interface IStaticStorage {
  price: {[id in Consummable]: number}
}

export interface IConsuming {
  name: Consummable;
  consomation: number;
  interval: number;
  probability: number;
}

export interface IStorage {
  name: Storage;
  capacity: number;
}

export type IStaticJobInfo = {[id in Job]: IStaticJob }

export interface IStaticJob {
  produce: {[id in Consummable]: IStaticJobProduction | null }
  consume: {[id in Consummable]: IStaticJobProduction | null }
  interval: number,
  storage?: IStorage
}

export interface IStaticJobProduction {
  probability: number,
  quantity: number,
}

export const StaticStorageInfo: IStaticStorageInfo = {
  villages: {
    price: {
      population: 0,
      food: 0,
      sticks: 10,
      stones: 0,
      coals: 0
    },
  },
  barns: {
    price: {
      population: 0,
      food: 5,
      sticks: 15,
      stones: 0,
      coals: 0
    }
  },
  farms: {
    price: {
      population: 0,
      food: 10,
      sticks: 20,
      stones: 0,
      coals: 0
    }
  },
  coalMines: {
    price: {
      population: 0,
      food: 0,
      sticks: 50,
      stones: 50,
      coals: 0
    }
  }
}

export const StaticConsummableInfo: IStaticConsummableInfo = {
  population: {
    storage: {
      name: Storage.villages,
      capacity: 10
    },
  },
  food: {
    storage: {
      name: Storage.barns,
      capacity: 10
    },
  },
  sticks: {
    storage: undefined,
  },
  stones: {
    storage: undefined,
  },
  coals: {
    storage: undefined,
  },
};

export const StaticJobInfo: IStaticJobInfo = {
  'woodGatherer': {
    produce: {
      'population': null,
      'food': null,
      'sticks': {
        probability: 1,
        quantity: 1
      },
      'stones': null,
      'coals': null,
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 1
      },
      'sticks': null,
      'stones': null,
      'coals': null,
    },
    interval: 5000,
  },
  'berryGatherer': {
    produce: {
      'population': null,
      'sticks': null,
      'food': {
        probability: 1,
        quantity: 1
      },
      'stones': null,
      'coals': null,
    },
    consume: {
      'population': null,
      'food': null,
      'sticks': null,
      'stones': null,
      'coals': null,
    },
    interval: 5000,
  },
  'farmer': {
    produce: {
      'population': null,
      'sticks': null,
      'food': {
        probability: 1,
        quantity: 8
      },
      'stones': null,
      'coals': null,
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 2
      },
      'sticks': {
        probability: 1,
        quantity: 1
      },
      'stones': null,
      'coals': null,
    },
    interval: 10000,
    storage: {
      name: Storage.farms,
      capacity: 3
    },
  },
  'stoneGatherer': {
    produce: {
      'population': null,
      'food': null,
      'sticks': null,
      'stones': {
        probability: 1,
        quantity: 1
      },
      'coals': null,
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 1
      },
      'sticks': null,
      'stones': null,
      'coals': null,
    },
    interval: 10000,
  },
  'miner': {
    produce: {
      'population': null,
      'food': null,
      'sticks': null,
      'stones': {
        probability: 1,
        quantity: 1
      },
      'coals': {
        probability: 1,
        quantity: 2
      },
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 3
      },
      'sticks': {
        probability: 1,
        quantity: 2
      },
      'stones': null,
      'coals': null,
    },
    interval: 15000,
    storage: {
      name: Storage.coalMines,
      capacity: 3
    },
  },
  'default':  {
    produce: {
      'population': {
        probability: 1,
        quantity: 1
      },
      'food': null,
      'sticks': null,
      'stones': null,
      'coals': null,
    },
    consume: {
      'population': null,
      'food': null,
      'sticks': null,
      'stones': null,
      'coals': null,
    },
    interval: 10000,
  },
}