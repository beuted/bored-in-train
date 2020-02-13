export enum Environment {
    Water = 1,
    Field = 2,
    Beach = 4,
    Snow = 7,
    Concrete = 8,
}

export function environmentName(env: Environment) {
    switch(env) {
        case Environment.Water: return 'sea';
        case Environment.Field: return 'field';
        case Environment.Beach: return 'beach';
        case Environment.Snow: return 'snow';
        case Environment.Concrete: return 'mountain';

    }
}