export enum Building {
  forest = "forest",
  village = "village",
  watchTower = "watchTower",
  gathererHut = "gathererHut",
  druidHut = "druidHut",
  barn = "barn",
  farm = "farm",
  sawmill = "sawmill",
  coalMine = "coalMine",
  stoneMine = "stoneMine",
  limestoneMine = "limestoneMine",
  limestoneBrickFactory = "limestoneBrickFactory",
  coalPowerStation = "coalPowerStation",
  windmill = "windmill",
  stoneWatchTower = "stoneWatchTower",
  coalDeposite = "coalDeposite",
  limestoneDeposite = "limestoneDeposite",
  lighthouse = "lighthouse",
}

export function isAMine(building: Building | null) {
  return (
    building == Building.limestoneMine ||
    building == Building.stoneMine ||
    building == Building.coalMine
  );
}
