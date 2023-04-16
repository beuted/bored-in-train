import { Consumable } from "@/models/Consumable";
import { Building } from "@/models/Building";
import { Research } from "@/models/Research";
import { Environment } from "@/models/Environment";

export const GlobalConfig = {
  TickInterval: 500,
};

export type IStaticConsumableInfo = { [id in Consumable]: IStaticConsumable };
export type IStaticBuildingInfo = { [id in Building]: IStaticBuilding };
export type IStaticEnvironmentInfo = { [id: number]: { icons: string[] } };

export interface IStaticConsumable {
  name: string;
  icon: string;
  storage: IStorage | undefined;
}

export interface IStaticBuilding {
  name: string;
  icon: string;
  description: string;
  highlightAdjacentTiles: boolean;
  canBeBuilt: boolean;
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
export const StaticEnvironmentInfo: IStaticEnvironmentInfo = {
  [Environment.Beach]: { icons: ["./img/beach.png", "./img/beach2.png"] },
  [Environment.Concrete]: {
    icons: ["./img/concrete.png", "./img/concrete2.png"],
  },
  [Environment.Field]: {
    icons: [
      "./img/field.png",
      "./img/field.png",
      "./img/field2.png",
      "./img/field2.png",
      "./img/field3.png",
      "./img/field3.png",
      "./img/field4.png",
      "./img/field5.png",
    ],
  },
  [Environment.Snow]: { icons: ["./img/snow.png", "./img/snow2.png"] },
  [Environment.Water]: { icons: ["./img/mer.png", "./img/mer2.png"] },
};

export const StaticBuildingInfo: IStaticBuildingInfo = {
  village: {
    name: "Village",
    icon: "./img/maison.png",
    description:
      "Increases your population. The more villages there are around it the more population it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 0,
      food: 0,
      wood: 2,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      population: {
        quantity: 2,
        bonusesForAdjacentBuilding: [{ for: Building.village, quantity: 1 }],
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.druidHut,
        buildingPattern: { building: Building.village, distance: 1 },
      },
      {
        to: Building.school,
        buildingPattern: { building: Building.druidHut, distance: 1 },
      },
    ],
  },
  gathererCamp: {
    name: "Gatherer Camp",
    icon: "./img/caravan.png", //TODO: change
    description:
      "Camp from where people will collect some woods. They will collect different resources depending on their location.",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 2,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      wood: {
        quantity: 5,
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.stoneMine,
        onEnvironment: Environment.Concrete,
      },
      {
        to: Building.sawmill,
        nextToBuilding: Building.forest,
      },
    ],
  },
  druidHut: {
    name: "Druid hut",
    icon: "./img/tente.png",
    description:
      "Hut where a druid can do some experiments and gather knowledge. Can be created by building villages around a village.",
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 1,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      knowledge: {
        quantity: 5,
      },
    },
    consume: {},
    transformations: [],
  },
  school: {
    name: "School",
    icon: "./img/maison2.png",
    description:
      "School is dope for learning! Can be created by building druid huts around a village.",
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 1,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      knowledge: {
        quantity: 20,
      },
    },
    consume: {},
    transformations: [],
  },
  barn: {
    name: "Barns",
    icon: "./img/entrepot2.png",
    description: "Increases the quantity of resources you can store by 20",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 0,
      food: 5,
      wood: 10,
      stones: 10,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [
      {
        to: Building.coalMine,
        nextToBuilding: Building.coalDeposite,
      },
    ],
  },
  farm: {
    name: "Farm",
    icon: "./img/farm2.png",
    description:
      "Get food for your population. The more farms there are around it the more food it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 3,
      food: 0,
      wood: 2,
      stones: 5,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      food: {
        quantity: 2,
        bonusesForAdjacentBuilding: [{ for: Building.farm, quantity: 1 }],
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.windmill,
        buildingPattern: { building: Building.farm, distance: 1 },
      },
    ],
  },
  windmill: {
    name: "Windmill",
    icon: "./img/windmill2.png",
    description:
      "Get more food for your population. Can be created by building a custer of farms.",
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 3,
      food: 0,
      wood: 5,
      stones: 5,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      food: {
        quantity: 5,
        bonusesForAdjacentBuilding: [{ for: Building.farm, quantity: 1 }],
      },
    },
    consume: {},
    transformations: [],
  },
  sawmill: {
    name: "Sawmill",
    icon: "./img/sawmill.png",
    description:
      "Gather wood nearby. Can be created by building a gatherer camp next to a forest. The more forests there are around it the more wood it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 2,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      wood: {
        quantity: 10,
        bonusesForAdjacentBuilding: [{ for: Building.forest, quantity: 2 }],
      },
    },
    consume: {},
    transformations: [],
  },
  stoneMine: {
    name: "Stone Mine",
    icon: "./img/mine.png",
    description:
      "Extract stone from the ground. Can be created by building a gatherer camp on a mountain tile. The more mountains there are around it the more stone it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 2,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      stones: {
        quantity: 10,
        bonusesForAdjacentEnvironment: [
          { for: Environment.Concrete, quantity: 5 },
        ],
      },
    },
    consume: {},
    transformations: [],
  },
  coalMine: {
    name: "Coal Mine",
    icon: "./img/minecharbon2.png",
    description:
      "Extract coal from the ground. Can be created by building a barn next to a coal deposit. The more coal deposites there are around it the more coal it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 2,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      coals: {
        quantity: 10,
        bonusesForAdjacentBuilding: [
          { for: Building.coalDeposite, quantity: 5 },
        ],
      },
    },
    consume: {},
    transformations: [],
  },
  factory: {
    name: "Factory",
    icon: "./img/factory.png",
    description: "Base building to transform resources.",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 3,
      food: 0,
      wood: 10,
      stones: 10,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [
      {
        to: Building.brickFactory,
        nextToBuilding: Building.stoneMine,
      },
      {
        to: Building.plankFactory,
        nextToBuilding: Building.sawmill,
      },
    ],
  },
  plankFactory: {
    name: "Plank Factory",
    icon: "./img/plankfactory.png",
    description:
      "Build planks out of wood. Can be created by building a factory next to a sawmill. The more sawmills there are around it the more planks it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 3,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      plank: {
        quantity: 10,
        bonusesForAdjacentBuilding: [{ for: Building.sawmill, quantity: 5 }],
      },
    },
    consume: {},
    transformations: [],
  },
  brickFactory: {
    name: "Brick Factory",
    icon: "./img/brick-factory2.png",
    description:
      "Build bricks out of stone. Can be created by building a factory next to a stone mine. The more stone mines there are around it the more bricks it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 3,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      brick: {
        quantity: 10,
        bonusesForAdjacentBuilding: [{ for: Building.stoneMine, quantity: 5 }],
      },
    },
    consume: {},
    transformations: [],
  },
  coalPlant: {
    name: "Coal Plant",
    icon: "./img/centralecharbon2.png",
    description:
      "Create energy by burning coal. Can be created by building a powerfarm next to a coal mine. The more coal mines there are around it the more energy it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 3,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      energy: {
        quantity: 10,
        bonusesForAdjacentBuilding: [{ for: Building.coalMine, quantity: 5 }],
      },
    },
    consume: {},
    transformations: [],
  },
  woodPlant: {
    name: "Wood power Plant",
    icon: "./img/centralebois.png",
    description:
      "Create energy by burning wood. Can be created by building a powerfarm next to a sawmill. The more sawmills there are around it the more energy it will produce.",
    highlightAdjacentTiles: true,
    canBeBuilt: false,
    price: {
      population: 3,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      energy: {
        quantity: 2,
        bonusesForAdjacentBuilding: [{ for: Building.sawmill, quantity: 2 }],
      },
    },
    consume: {},
    transformations: [],
  },
  watchTower: {
    name: "Watch tower",
    icon: "./img/watch-tower-wood.png",
    description: "Let you explore the surrounding land.",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 1,
      food: 0,
      wood: 10,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [
      {
        to: Building.castle,
        buildingPattern: { building: Building.village, distance: 2 },
      },
      {
        to: Building.stoneWatchTower,
        buildingPattern: { building: Building.village, distance: 1 },
      },
      {
        to: Building.lighthouse,
        nextToEnvironment: Environment.Water,
      },
      {
        to: Building.village,
        buildingPattern: { building: Building.village, distance: 3 },
      },
    ],
  },
  stoneWatchTower: {
    name: "Stone watch tower",
    icon: "./img/watch-tower.png",
    description:
      "Let you explore the surrounding land on a large radius. Can be created by building villages around a watch tower.",
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 0,
      food: 0,
      wood: 10,
      stones: 10,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [
      {
        to: Building.castle,
        buildingPattern: { building: Building.village, distance: 2 },
      },
    ],
  },
  castle: {
    name: "Castle",
    icon: "./img/watch-tower2.png",
    description:
      "Let you explore the surrounding land on a huge radius. Can be created by building villages around a stone watch tower.",
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 0,
      food: 0,
      wood: 50,
      stones: 0,
      coals: 0,
      brick: 0,
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
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      brick: 0,
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
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 0,
      food: 0,
      wood: 20,
      stones: 0,
      coals: 0,
      brick: 0,
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
    description:
      "Let you explore the surrounding land and sea. Can be created by building a watch tower next to the sea.",
    highlightAdjacentTiles: false,
    canBeBuilt: false,
    price: {
      population: 0,
      food: 0,
      wood: 10,
      stones: 0,
      coals: 0,
      brick: 0,
      energy: 0,
      knowledge: 0,
    },
    produce: {},
    consume: {},
    transformations: [],
  },
  powerfarm: {
    name: "Power farm",
    icon: "./img/powerfarm.png",
    description: "Base building for energy production.",
    highlightAdjacentTiles: true,
    canBeBuilt: true,
    price: {
      population: 5,
      food: 0,
      wood: 0,
      stones: 0,
      coals: 10,
      brick: 10,
      plank: 10,
      energy: 0,
      knowledge: 0,
    },
    produce: {
      energy: {
        quantity: 2,
        bonusesForAdjacentBuilding: [{ for: Building.sawmill, quantity: 2 }],
      },
    },
    consume: {},
    transformations: [
      {
        to: Building.coalPlant,
        nextToBuilding: Building.coalMine,
      },
      {
        to: Building.woodPlant,
        nextToBuilding: Building.sawmill,
      },
    ],
  },
  rocketSilo: {
    name: "Rocket silo",
    icon: "./img/rocket-silo.png",
    description: "We've got to find another planet now.",
    highlightAdjacentTiles: false,
    canBeBuilt: true,
    price: {
      population: 50,
      food: 50,
      coals: 50,
      plank: 50,
      brick: 50,
      energy: 50,
      knowledge: 50,
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
    icon: "./img/food3.png",
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
    icon: "./img/stone.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  plank: {
    name: "Plank",
    icon: "./img/plank2.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  coals: {
    name: "Coals",
    icon: "./img/coal.png",
    storage: {
      name: Building.barn,
      capacity: 20,
    },
  },
  brick: {
    name: "Bricks",
    icon: "./img/brick.png",
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
  bonusesForAdjacentBuilding?: { for: Building; quantity: number }[];
  bonusesForAdjacentEnvironment?: { for: Environment; quantity: number }[];
}

export type IResearchInfo = { [id in Research]: IStaticResearch };

export interface IStaticResearch {
  name: string;
  icon: string;
  description: string;
  price: { [id in Consumable]?: number };
  prerequisite: Research[];
  neededBuildings: Building[];
  unlocks: { buildings: Building[] };
}

export const ResearchInfo: IResearchInfo = {
  agriculture: {
    name: "Agriculture",
    icon: "./img/farm2.png",
    description: "Allows you to build farms to create food",
    price: {
      [Consumable.wood]: 40,
      [Consumable.stones]: 10,
    },
    prerequisite: [],
    neededBuildings: [Building.sawmill, Building.stoneMine],
    unlocks: {
      buildings: [Building.farm],
    },
  },
  storage: {
    name: "Storage",
    icon: "./img/entrepot2.png",
    description: "Allows you to build barns to store more resources",
    price: {
      [Consumable.food]: 40,
      [Consumable.population]: 20,
      [Consumable.knowledge]: 5,
    },
    prerequisite: [Research.agriculture],
    neededBuildings: [Building.windmill, Building.druidHut],
    unlocks: {
      buildings: [Building.barn],
    },
  },
  factory: {
    name: "Factory",
    icon: "./img/factory.png",
    description: "Allows you to build factories to refine materials",
    price: {
      [Consumable.wood]: 100,
      [Consumable.stones]: 100,
      [Consumable.coals]: 20,
    },
    prerequisite: [Research.storage],
    neededBuildings: [Building.coalMine, Building.stoneMine],
    unlocks: {
      buildings: [Building.factory],
    },
  },
  energy: {
    name: "Energy",
    icon: "./img/powerfarm.png",
    description: "Allows you to build powerfarms to create energy",
    price: {
      [Consumable.plank]: 50,
      [Consumable.brick]: 50,
      [Consumable.knowledge]: 15,
    },
    prerequisite: [Research.factory],
    neededBuildings: [Building.plankFactory, Building.brickFactory],
    unlocks: {
      buildings: [Building.powerfarm],
    },
  },
  spaceProgram: {
    name: "Space Program",
    icon: "./img/rocket-silo.png",
    description:
      "Look at what we've done with this place, we've got to find a new planet",
    price: {
      [Consumable.energy]: 100,
      [Consumable.knowledge]: 50,
    },
    prerequisite: [Research.energy],
    neededBuildings: [Building.woodPlant, Building.coalPlant],
    unlocks: {
      buildings: [Building.rocketSilo],
    },
  },
};
