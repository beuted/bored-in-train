import { Consummable } from '@/models/Consummable';
import { Job } from '@/models/Job';
import { Storage } from '@/models/Storage';
import { Research } from '@/models/Research';

export type IStaticConsummableInfo = {[id in Consummable]: IStaticConsummable}
export type IStaticStorageInfo = {[id in Storage]: IStaticStorage}

export interface IStaticConsummable {
  name: string;
  icon: string;
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
    name: 'Barns',
    description: 'Increases the quantity of food you can store by 20',
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0
    }
  },
  farms: {
    name: 'Farm',
    description: 'Allows you to recruit 3 farmers',
    price: {
      population: 0,
      food: 5,
      wood: 20,
      stones: 5,
      coals: 0
    }
  },
  coalMines: {
    name: 'Coal Mine',
    description: 'Allows you to recruit 3 miners, must be built on a coal deposite',
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
    name: 'Population',
    icon: '🙋‍♂️',
    storage: {
      name: Storage.villages,
      capacity: 10
    },
  },
  food: {
    name: 'Food',
    icon: '🍗',
    storage: {
      name: Storage.barns,
      capacity: 20
    },
  },
  wood: {
    name: 'Wood',
    icon: '🌲',
    storage: undefined,
  },
  stones: {
    name: 'Stones',
    icon: '⛏️' ,
    storage: undefined,
  },
  coals: {
    name: 'Coals',
    icon: '💎',
    storage: undefined,
  },
};

export type IStaticJobInfo = {[id in Job]: IStaticJob }

export interface IStaticJob {
  name: string;
  description: string;
  produce: {[id in Consummable]: IStaticJobProduction | null };
  consume: {[id in Consummable]: IStaticJobProduction | null };
  interval: number;
  storage?: IStorage;
}

export interface IStaticJobProduction {
  probability: number;
  quantity: number;
}

export const StaticJobInfo: IStaticJobInfo = {
  'woodGatherer': {
    name: 'Wood gatherer',
    description: 'Wanders around finding wood',
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
    name: 'Berry gatherer',
    description: 'Wanders around finding food',
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
  'explorer': {
    name: 'Explorer',
    description: 'Discovers new ground to build on',
    produce: {
      'population': null,
      'wood': null,
      'food': null,
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
  'scientist': {
    name: 'Scientist',
    description: 'Allows to unlock new technology in the Research tab',
    produce: {
      'population': null,
      'wood': null,
      'food': null,
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
  'farmer': {
    name: 'Farmer',
    description: 'Produces food at the cost of wood',
    produce: {
      'population': null,
      'wood': null,
      'food': {
        probability: 1,
        quantity: 4
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
      'wood': {
        probability: 1,
        quantity: 0.5
      },
      'stones': null,
      'coals': null,
    },
    interval: 5000,
    storage: {
      name: Storage.farms,
      capacity: 3
    },
  },
  'stoneGatherer': {
    name: 'Stone gatherer',
    description: 'Wanders around finding stone',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': {
        probability: 1,
        quantity: 0.5
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
    interval: 5000,
  },
  'miner': {
    name: 'Miner',
    description: 'Extract coal and stone form the ground at the cost of wood',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': {
        probability: 1,
        quantity: 0.5
      },
      'coals': {
        probability: 1,
        quantity: 1
      },
    },
    consume: {
      'population': null,
      'food': {
        probability: 1,
        quantity: 1
      },
      'wood': {
        probability: 1,
        quantity: 1
      },
      'stones': null,
      'coals': null,
    },
    interval: 5000,
    storage: {
      name: Storage.coalMines,
      capacity: 3
    },
  },
  'default':  {
    name: 'DEFAULT',
    description: '',
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
};

export type IResearchInfo = { [id in Research]: IStaticResearch }

export interface IStaticResearch {
  name: string;
  description: string;
  price: number;
  prerequisite: Research[];
}

export const ResearchInfo: IResearchInfo = {
  agriculture: {
    name: 'Agriculture',
    description: 'Aggriculture allows you to build farms',
    price: 10,
    prerequisite: []
  },
  steamLocomotive: {
    name: 'Steam Locomotive',
    description: 'Allow you to build coal powered factories',
    price: 100,
    prerequisite: [Research.agriculture]
  },
}