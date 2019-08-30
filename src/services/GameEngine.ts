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
      limestone: 0,
      limestoneBrick: 0,
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
      limestone: 0,
      limestoneBrick: 0,
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
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0
    }
  },
  stoneMine: {
    name: 'Stone Mine',
    description: 'Allows you to recruit 3 stoneminers, must be built on a stone deposite',
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 30,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0
    }
  },
  coalMine: {
    name: 'Coal Mine',
    description: 'Allows you to recruit 3 coal miners, must be built on a coal deposite',
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 100,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0
    }
  },
  limestoneMine: {
    name: 'Limestone Mine',
    description: 'Allows you to recruit 3 limestone miners, must be built on a limestone deposite',
    price: {
      population: 0,
      food: 0,
      wood: 100,
      stones: 150,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0
    }
  },
  limestoneBrickFactory: {
    name: 'Brick Factory',
    description: 'Allows you to recruit 3 brick workers',
    price: {
      population: 0,
      food: 0,
      wood: 200,
      stones: 200,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
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
      wood: 200,
      stones: 50,
      coals: 0,
      limestone: 0,
      limestoneBrick: 150,
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
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0
    }
  }
}

export const StaticConsummableInfo: IStaticConsummableInfo = {
  population: {
    name: 'Population',
    icon: './img/steel.png',
    storage: {
      name: Building.village,
      capacity: 10
    },
  },
  food: {
    name: 'Food',
    icon: './img/steel.png',
    storage: {
      name: Building.barn,
      capacity: 20
    },
  },
  wood: {
    name: 'Wood',
    icon: './img/bois.png',
    storage: {
      name: Building.barn,
      capacity: 20
    },
  },
  stones: {
    name: 'Stone',
    icon: './img/stone-particle.png' ,
    storage: {
      name: Building.barn,
      capacity: 20
    },
  },
  coals: {
    name: 'Coals',
    icon: './img/coal-particle.png',
    storage: {
      name: Building.barn,
      capacity: 20
    },
  },
  limestone: {
    name: 'Limestones',
    icon: './img/limestone-particle.png',
    storage: {
      name: Building.barn,
      capacity: 20
    },
  },
  limestoneBrick: {
    name: 'Bricks',
    icon: './img/limestone-brick.png',
    storage: {
      name: Building.barn,
      capacity: 20
    },
  },
  energy: {
    name: 'Energy',
    icon: './img/steel.png',
    storage: undefined,
  },
  knowledge: {
    name: 'Knowledge',
    icon: './img/steel.png',
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
    consume: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
  },
  'druid': {
    name: 'Druid',
    description: 'Allows to unlock new technology in the Research tab',
    produce: {
      'population': null,
      'wood': null,
      'food': null,
      'stones': null,
      'coals': null,
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
  },
  'stoneMiner': {
    name: 'Stone Miner',
    description: 'Extract stone from the ground at the cost of wood',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': {
        probability: 1,
        quantity: 1
      },
      'coals': null,
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.stoneMine,
      capacity: 3
    },
  },
  'coalMiner': {
    name: 'Coal Miner',
    description: 'Extract coal and stone from the ground at the cost of wood',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': {
        probability: 1,
        quantity: 1
      },
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.coalMine,
      capacity: 3
    },
  },
  'limestoneMiner': {
    name: 'Limestone Miner',
    description: 'Extract limestone from the ground at the cost of wood',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'limestone': {
        probability: 1,
        quantity: 1
      },
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.limestoneMine,
      capacity: 3
    },
  },
  'limestoneBrickWorker': {
    name: 'brick worker',
    description: 'Create bricks out of limestone and coal',
    produce: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'limestone': null,
      'limestoneBrick': {
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
      'wood': null,
      'stones': null,
      'coals': {
        probability: 1,
        quantity: 1
      },
      'limestone': {
        probability: 1,
        quantity: 2
      },
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
    storage: {
      name: Building.limestoneBrickFactory,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
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
      'limestone': null,
      'limestoneBrick': null,
      'knowledge': null,
      'energy': null,
    },
    consume: {
      'population': null,
      'food': null,
      'wood': null,
      'stones': null,
      'coals': null,
      'limestone': null,
      'limestoneBrick': null,
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
      buildings: [Building.farm],
    }
  },
  mining: {
    name: 'Mining',
    description: 'Allows you to build mines',
    price: 100,
    prerequisite: [],
    unlocks: {
      buildings: [Building.coalMine, Building.stoneMine, Building.limestoneMine],
    }
  },
  factory: {
    name: 'Factory',
    description: 'Allows you to build factories',
    price: 200,
    prerequisite: [Research.mining],
    unlocks: {
      buildings: [Building.limestoneBrickFactory],
    }
  },
  navigation: {
    name: 'Navigation',
    description: 'Let you discover lands across the sea',
    price: 400,
    prerequisite: [Research.factory],
    unlocks: {
      buildings: [],
    }
  },
  steamLocomotive: {
    name: 'Steam Locomotive',
    description: 'Allows you to build coal powered factories',
    price: 400,
    prerequisite: [Research.factory],
    unlocks: {
      buildings: [Building.coalPowerStation],
    }
  },
}