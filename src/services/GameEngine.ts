import { Consummable } from '@/models/Consummable';
import { Job } from '@/models/Job';
import { Building } from '@/models/Building';
import { Research } from '@/models/Research';


export const GlobalConfig = {
  TickInterval: 5000
}

export type IStaticConsummableInfo = {[id in Consummable]: IStaticConsummable}
export type IStaticBuildingInfo = {[id in Building]: IStaticBuilding}

export interface IStaticConsummable {
  name: string;
  icon: string;
  storage: IStorage | undefined;
}

export interface IStaticBuilding {
  name: string;
  description: string;
  price: {[id in Consummable]: number};
}

export interface IConsuming {
  name: Consummable;
  consomation: number;
  probability: number;
}

export interface IStorage {
  name: Building;
  capacity: number;
}

export const StaticBuildingInfo: IStaticBuildingInfo = {
  village: {
    name: 'Village',
    description: 'Increases your maximum population by 10',
    price: {
      population: 0,
      food: 0,
      wood: 10,
      stones: 0,
      coals: 0,
      energy: 0,
      knowledge: 0
    },
  },
  barn: {
    name: 'Barns',
    description: 'Increases the quantity of food you can store by 20',
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      energy: 0,
      knowledge: 0
    }
  },
  farm: {
    name: 'Farm',
    description: 'Allows you to recruit 3 farmers',
    price: {
      population: 0,
      food: 0,
      wood: 25,
      stones: 5,
      coals: 0,
      energy: 0,
      knowledge: 0
    }
  },
  coalMine: {
    name: 'Coal Mine',
    description: 'Allows you to recruit 3 miners, must be built on a coal deposite',
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 50,
      coals: 0,
      energy: 0,
      knowledge: 0
    }
  },
  coalPowerStation: {
    name: 'Coal Power Station',
    description: 'Allows you to recruit 3 coal station engineer',
    price: {
      population: 0,
      food: 0,
      wood: 25,
      stones: 100,
      coals: 0,
      energy: 0,
      knowledge: 0
    }
  },
  forest: {
    name: 'Forest',
    description: 'Just a bunch of trees',
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 0,
      coals: 0,
      energy: 0,
      knowledge: 0
    }
  }
}

export const StaticConsummableInfo: IStaticConsummableInfo = {
  population: {
    name: 'Population',
    icon: '🙋‍♂️',
    storage: {
      name: Building.village,
      capacity: 10
    },
  },
  food: {
    name: 'Food',
    icon: '🍗',
    storage: {
      name: Building.barn,
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
  energy: {
    name: 'Energy',
    icon: '⚡',
    storage: undefined,
  },
  knowledge: {
    name: 'Knowledge',
    icon: '🔬',
    storage: undefined,
  }
};

export type IStaticJobInfo = {[id in Job]: IStaticJob }

export interface IStaticJob {
  name: string;
  description: string;
  produce: {[id in Consummable]: IStaticJobProduction | null };
  consume: {[id in Consummable]: IStaticJobProduction | null };
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
      'knowledge': null,
      'energy': null,
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
      'knowledge': null,
      'energy': null,
    },
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
      'knowledge': null,
      'energy': null,
    },
    consume: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'knowledge': null,
      'energy': null,
    },
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
      'knowledge': null,
      'energy': null,
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
      'knowledge': null,
      'energy': null,
    },
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
      'knowledge': {
        probability: 1,
        quantity: 1
      },
      'energy': null,
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
      'knowledge': null,
      'energy': null,
    },
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
      'knowledge': null,
      'energy': null,
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
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.farm,
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
      'knowledge': null,
      'energy': null,
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
      'knowledge': null,
      'energy': null,
    },
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
      'knowledge': null,
      'energy': null,
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
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.coalMine,
      capacity: 3
    },
  },
  'coalStationEngineer': {
    name: 'Coal Station Eng.',
    description: 'Burn coal in order to procude energy',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'knowledge': null,
      'energy': {
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
      'wood': null,
      'stones': null,
      'coals': {
        probability: 1,
        quantity: 2
      },
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.coalPowerStation,
      capacity: 3
    },
  },
  'default':  {
    name: 'DEFAULT',
    description: '',
    produce: {
      'population': {
        probability: 1,
        quantity: 0.5
      },
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'knowledge': null,
      'energy': null,
    },
    consume: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'knowledge': null,
      'energy': null,
    },
  },
};

export type IResearchInfo = { [id in Research]: IStaticResearch }

export interface IStaticResearch {
  name: string;
  description: string;
  price: number;
  prerequisite: Research[];
  unlocks: { buildings: Building[] };
}

export const ResearchInfo: IResearchInfo = {
  agriculture: {
    name: 'Agriculture',
    description: 'Aggriculture allows you to build farms',
    price: 10,
    prerequisite: [],
    unlocks: {
      buildings: [Building.farm]
    }
  },
  mining: {
    name: 'Mining',
    description: 'Allows you to build coal mines',
    price: 100,
    prerequisite: [],
    unlocks: {
      buildings: [Building.coalMine]
    }
  },
  steamLocomotive: {
    name: 'Steam Locomotive',
    description: 'Allows you to build coal powered factories',
    price: 200,
    prerequisite: [Research.mining],
    unlocks: {
      buildings: [Building.coalPowerStation]
    }
  },
}