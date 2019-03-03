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
  interval: number
}

export interface IStaticJobProduction {
  probability: number,
  quantity: number,
}

export const StaticStorageInfo: IStaticStorageInfo = {
  villages: {
    price: {
      sticks: 10,
      food: 0,
      population: 0
    },
  },
  barns: {
    price: {
      sticks: 15,
      food: 5,
      population: 0
    }
  },
  farms: {
    price: {
      sticks: 20,
      food: 10,
      population: 0
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
};

export const StaticJobInfo: IStaticJobInfo = {
  'woodGatherer': {
    produce: {
      'population': null,
      'food': null,
      'sticks': {
        probability: 1,
        quantity: 1
      }
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 1
      },
      'sticks': null
    },
    interval: 5000,
  },
  'berryGatherer': {
    produce: {
      'population': null,
      'sticks': null,
      'food': {
        probability: 1,
        quantity: 2
      },
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 1
      },
      'sticks': null
    },
    interval: 5000,
  },
  'default':  {
    produce: {
      'population': {
        probability: 1,
        quantity: 1
      },
      'food': null,
      'sticks': null,
    },
    consume: {
      'population': null,
      'food': null,
      'sticks': null
    },
    interval: 10000,
  },
}