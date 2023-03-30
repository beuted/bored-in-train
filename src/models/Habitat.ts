export enum Habitat {
  CoalDeposite = 2,
  StoneDeposite = 3,
  LimestoneDeposite = 4,
}

export function habitatName(habitat: Habitat) {
  switch (habitat) {
    case Habitat.CoalDeposite:
      return "coal deposite";
    case Habitat.StoneDeposite:
      return "stone deposite";
    case Habitat.LimestoneDeposite:
      return "limestone deposite";
  }
}
