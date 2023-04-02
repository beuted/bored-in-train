import { Consumable } from "@/models/Consumable";
import { Building } from "@/models/Building";
import { Research } from "@/models/Research";
import { Environment } from "@/models/Environment";

export const GlobalConfig = {
  TickInterval: 5000,
};

export type IStaticConsumableInfo = { [id in Consumable]: IStaticConsumable };
export type IStaticBuildingInfo = { [id in Building]: IStaticBuilding };

export interface IStaticConsumable {
  name: string;
  icon: string;
  storage: IStorage | undefined;
}

export interface IStaticBuilding {
  name: string;
  icon: string;
  description: string;
  produce: { [id in Consumable]?: IStaticBuildingProduction };
  consume: { [id in Consumable]?: IStaticBuildingProduction };
  transformations: {
    to: Building;
    nextToBuilding?: Building;
    nextToEnvironment?: Environment;
    onEnvironment?: Environment;
    buildingPattern?: { building: Building; distance: number };
  }[];
  price: { [id in Consumable]?: number };
}

export interface IConsuming {
  name: Consumable;
  consomation: number;
}

export interface IStorage {
  name: Building;
  capacity: number;
}

export const StaticBuildingInfo: IStaticBuildingInfo = {
  village: {
    name: "Village",
    icon: "./img/maison.png",
    description: "Increases your maximum population by 10",
    price: {
      population: 0,
      food: 0,
      wood: 10,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      population: {
        quantity: 0,
        bonusesForBuilding: [{ for: Building.village, quantity: 0.1 }],
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.druidHut,
        buildingPattern: { building: Building.village, distance: 1 },
      },
      {
        to: Building.coalMine,
        buildingPattern: { building: Building.druidHut, distance: 1 },
      },
    ],
  },
  gathererHut: {
    name: "Gatherer Hut",
    icon: "./img/caravan.png", //TODO: change
    description:
      "Hut from where people will go try to find some rocks and woods. They'll find berries on their journey so you don't need to feed them.",
    price: {
      population: 2,
      food: 0,
      wood: 10,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      wood: {
        quantity: 0.25,
        bonusesForBuilding: [{ for: Building.forest, quantity: 0.5 }],
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.sawmill,
        buildingPattern: { building: Building.forest, distance: 1 },
      },
      {
        to: Building.stoneMine,
        onEnvironment: Environment.Concrete,
      },
      {
        to: Building.stoneMine,
        onEnvironment: Environment.Snow,
      },
      {
        to: Building.coalMine,
        nextToBuilding: Building.coalDeposite,
      },
      {
        to: Building.limestoneMine,
        nextToBuilding: Building.limestoneDeposite,
      },
    ],
  },
  druidHut: {
    name: "Druid Hut",
    icon: "./img/tente.png",
    description:
      "Hut where a druid can do some experiments and gather knowledge.",
    price: {
      population: 1,
      food: 0,
      wood: 50,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      knowledge: {
        quantity: 1,
      },
    },
    consume: {},
    transformations: [],
  },
  barn: {
    name: "Barns",
    icon: "./img/entrepot2.png",
    description: "Increases the quantity of resources you can store by 20 each",
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
  farm: {
    name: "Farm",
    icon: "./img/farm2.png",
    description: "Get food at the cost of wood",
    price: {
      population: 3,
      food: 0,
      wood: 25,
      stones: 5,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      food: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.windmill,
        buildingPattern: { building: Building.farm, distance: 2 },
      },
    ],
  },
  windmill: {
    name: "Windmill",
    icon: "./img/windmill2.png",
    description: "Get food at the cost of wood",
    price: {
      population: 3,
      food: 0,
      wood: 25,
      stones: 5,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      food: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  sawmill: {
    name: "Sawmill",
    icon: "./img/sawmill.png",
    description: "Gather wood nearby",
    price: {
      population: 3,
      food: 0,
      wood: 30,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      wood: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  stoneMine: {
    name: "Stone Mine",
    icon: "./img/minecalcaire.png",
    description: "Extract stone, must be built on a stone deposite",
    price: {
      population: 3,
      food: 0,
      wood: 50,
      stones: 30,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      stones: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  coalMine: {
    name: "Coal Mine",
    icon: "./img/minecharbon.png",
    description: "Extract coal, must be built on a coal deposite",
    price: {
      population: 3,
      food: 0,
      wood: 50,
      stones: 100,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      coals: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  limestoneMine: {
    name: "Limestone Mine",
    icon: "./img/minecalcaire.png",
    description: "Extract limestone, must be built on a limestone deposite",
    price: {
      population: 3,
      food: 0,
      wood: 100,
      stones: 150,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      limestone: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  limestoneBrickFactory: {
    name: "Brick Factory",
    icon: "./img/limestone-brick-factory.png",
    description: "Build bricks out of limestone",
    price: {
      population: 3,
      food: 0,
      wood: 200,
      stones: 200,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      limestoneBrick: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  coalPowerStation: {
    name: "Coal Power Station",
    icon: "./img/centralecharbon.png",
    description: "Create energy by burning coal",
    price: {
      population: 3,
      food: 0,
      wood: 200,
      stones: 50,
      coals: 0,
      limestone: 0,
      limestoneBrick: 150,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      energy: {
        quantity: 3,
      },
    },
    consume: {},
    transformations: [],
  },
  watchTower: {
    name: "Watch tower",
    icon: "./img/watch-tower-wood.png",
    description: "Let you explore the surrounding area",
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [
      {
        to: Building.stoneWatchTower,
        buildingPattern: { building: Building.village, distance: 1 },
      },
      {
        to: Building.lighthouse,
        nextToEnvironment: Environment.Water,
      },
    ],
  },
  stoneWatchTower: {
    name: "Stone watch tower",
    icon: "./img/watch-tower.png",
    description: "Let you explore the surrounding area on a large radius",
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
  forest: {
    name: "Forest",
    icon: "./img/arbres-stage3.png",
    description: "Just a bunch of trees",
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
  coalDeposite: {
    name: "Coal deposite",
    icon: "./img/coal-deposit.png",
    description: "Some coal to be gathered",
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
  limestoneDeposite: {
    name: "Limestone deposite",
    icon: "./img/limestone-deposit.png",
    description: "Some limestone to be gathered",
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
  lighthouse: {
    name: "Lighthouse",
    icon: "./img/lighthouse.png",
    description: "Guide boats safely to the shore",
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      limestone: 0,
      limestoneBrick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
};

export const StaticConsumableInfo: IStaticConsumableInfo = {
  population: {
    name: "Population",
    icon: "./img/population2.png",
    storage: undefined,
  },
  food: {
    name: "Food",
    icon: "./img/food2.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  wood: {
    name: "Wood",
    icon: "./img/bois.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  stones: {
    name: "Stone",
    icon: "./img/stone-particle.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  coals: {
    name: "Coals",
    icon: "./img/coal-particle.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  limestone: {
    name: "Limestones",
    icon: "./img/limestone-particle.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  limestoneBrick: {
    name: "Bricks",
    icon: "./img/limestone-brick.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  energy: {
    name: "Energy",
    icon: "./img/energy.png",
    storage: undefined,
  },
  knowledge: {
    name: "Knowledge",
    icon: "./img/knowledge.png",
    storage: undefined,
  },
};

export interface IStaticBuildingProduction {
  quantity: number;
  bonusesForBuilding?: { for: Building; quantity: number }[];
}

export type IResearchInfo = { [id in Research]: IStaticResearch };

export interface IStaticResearch {
  name: string;
  icon: string;
  description: string;
  price: number;
  prerequisite: Research[];
  unlocks: { buildings: Building[] };
}

export const ResearchInfo: IResearchInfo = {
  agriculture: {
    name: "Agriculture",
    icon: "./img/knowledge.png",
    description: "Aggriculture allows you to build farms",
    price: 10,
    prerequisite: [],
    unlocks: {
      buildings: [Building.druidHut],
    },
  },
  woodcutting: {
    name: "Woodcutting",
    icon: "./img/knowledge.png",
    description: "Woodcutting allows you to build Sawmill",
    price: 10,
    prerequisite: [Research.agriculture],
    unlocks: {
      buildings: [Building.sawmill],
    },
  },
  mining: {
    name: "Mining",
    icon: "./img/knowledge.png",
    description: "Allows you to build mines",
    price: 100,
    prerequisite: [Research.agriculture],
    unlocks: {
      buildings: [
        Building.coalMine,
        Building.stoneMine,
        Building.limestoneMine,
      ],
    },
  },
  factory: {
    name: "Factory",
    icon: "./img/knowledge.png",
    description: "Allows you to build factories",
    price: 200,
    prerequisite: [Research.mining],
    unlocks: {
      buildings: [Building.limestoneBrickFactory],
    },
  },
  navigation: {
    name: "Navigation",
    icon: "./img/knowledge.png",
    description: "Let you discover lands across the sea",
    price: 400,
    prerequisite: [Research.factory],
    unlocks: {
      buildings: [],
    },
  },
  steamLocomotive: {
    name: "Steam Locomotive",
    icon: "./img/knowledge.png",
    description: "Allows you to build coal powered factories",
    price: 400,
    prerequisite: [Research.factory],
    unlocks: {
      buildings: [Building.coalPowerStation],
    },
  },
};
