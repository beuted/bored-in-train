import { Consumable } from "@/models/Consumable";
import { Building } from "@/models/Building";
import { Research } from "@/models/Research";
import { Environment } from "@/models/Environment";
import { Habitat } from "@/models/Habitat";

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
  produce: { [id in Consumable]: IStaticBuildingProduction | null };
  consume: { [id in Consumable]: IStaticBuildingProduction | null };
  price: { [id in Consumable]: number };
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
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: {
        quantity: 0.5,
      },
      wood: {
        quantity: 0.25,
      },
      stones: {
        quantity: 0.25,
      },
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: {
        quantity: 1,
      },
      energy: null,
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
    produce: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: {
        quantity: 3,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: null,
      wood: {
        quantity: 1,
      },
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: {
        quantity: 3,
      },
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: null,
      stones: {
        quantity: 3,
      },
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: {
        quantity: 3,
      },
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: {
        quantity: 3,
      },
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: {
        quantity: 3,
      },
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: null,
      limestone: {
        quantity: 3,
      },
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: {
        quantity: 3,
      },
    },
    consume: {
      population: null,
      food: {
        quantity: 1,
      },
      wood: null,
      stones: null,
      coals: {
        quantity: 1,
      },
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
  },
  watchTower: {
    name: "Watch tower",
    icon: "./img/watch-tower.png",
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
    produce: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
    produce: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
    consume: {
      population: null,
      food: null,
      wood: null,
      stones: null,
      coals: null,
      limestone: null,
      limestoneBrick: null,
      knowledge: null,
      energy: null,
    },
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
      buildings: [Building.farm],
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
