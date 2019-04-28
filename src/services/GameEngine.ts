import { Consummable } from '@/models/Consummable';
import { Job } from '@/models/Job';
import { Storage } from '@/models/Storage';

export type IStaticConsummableInfo = {[id in Consummable]: IStaticConsummable}
export type IStaticStorageInfo = {[id in Storage]: IStaticStorage}

export interface IStaticConsummable {
  storage: IStorage | undefined;
}

export interface IStaticStorage {
  name: string;
  description: string;
  price: {[id in Consummable]: number};
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
    name: 'Village',
    description: 'Increases your maximum population by 10',
    price: {
      population: 0,
      food: 0,
      wood: 10,
      stones: 0,
      coals: 0
    },
  },
  barns: {
    name: 'Village',
    description: 'Increases the quantity of food you can store by 10',
    price: {
      population: 0,
      food: 5,
      wood: 15,
      stones: 0,
      coals: 0
    }
  },
  farms: {
    name: 'Farm',
    description: 'Allows you to recruit 3 farmers',
    price: {
      population: 0,
      food: 10,
      wood: 20,
      stones: 0,
      coals: 0
    }
  },
  coalMines: {
    name: 'Coal Mine',
    description: 'Allows you to recruit 3 miners',
    price: {
      population: 0,
      food: 0,
      wood: 50,
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
  wood: {
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
      'wood': {
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
      'wood': null,
      'stones': null,
      'coals': null,
    },
    interval: 5000,
  },
  'berryGatherer': {
    produce: {
      'population': null,
      'wood': null,
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
      'wood': null,
      'stones': null,
      'coals': null,
    },
    interval: 5000,
  },
  'farmer': {
    produce: {
      'population': null,
      'wood': null,
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
      'wood': {
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
      'wood': null,
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
      'wood': null,
      'stones': null,
      'coals': null,
    },
    interval: 10000,
  },
  'miner': {
    produce: {
      'population': null,
      'food': null,
      'wood': null,
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
      'wood': {
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
      'wood': null,
      'stones': null,
      'coals': null,
    },
    consume: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
    },
    interval: 10000,
  },
}