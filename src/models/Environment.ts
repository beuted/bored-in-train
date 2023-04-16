export enum Environment {
  Water = 1,
  Field = 2,
  Beach = 4,
  Snow = 7,
  Concrete = 8,
}

export function environmentName(env: Environment) {
  switch (env) {
    case Environment.Water:
      return "Sea";
    case Environment.Field:
      return "Field";
    case Environment.Beach:
      return "Beach";
    case Environment.Snow:
      return "Snow";
    case Environment.Concrete:
      return "Mountain";
  }
}
