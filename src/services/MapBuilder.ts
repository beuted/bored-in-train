import { Environment } from '@/models/Environment';
import { Building } from '@/models/Building';
import { IMapTile } from '@/models/IMapTile';
import SimplexNoise from 'simplex-noise';

export class MapBuilder {

    public static InitMap(size: number): IMapTile[][] {
        let simplexHeight = new SimplexNoise();
        let simplexTrees = new SimplexNoise();

        var center = Math.floor(size/2);
        const mapSize = size;
        // Build Environment and natural Buildings (forests, ...)
        let map: IMapTile[][] = [];
        for (let i = 0; i < mapSize; i++) {
            map[i] = [];
            for (let j = 0; j < mapSize; j++) {
                let height = MapBuilder.Mask(i,j) * MapBuilder.NoiseHeight(simplexHeight, i, j);
                let env = height <= 0 ? Environment.Water : (height > 0.08 ? Environment.Field : Environment.Beach);

                if ((env == Environment.Field || env == Environment.Beach) && Math.random() > 0.97) {
                    var seed = Math.random();
                    if (seed < 0.33)
                        env = Environment.CoalDeposite;
                    else if (seed < 0.66)
                        env = Environment.StoneDeposite
                    else
                        env = Environment.LimestoneDeposite
                }


                let isForest = env == Environment.Field && MapBuilder.NoiseTrees(simplexTrees, i, j) > 0.5;

                map[i][j] = {
                    building: isForest ? Building.forest: null,
                    environment: env,
                    discovered: false
                };
            }
        }

        // Build buildings
        map[center][center].environment = Environment.Field;
        map[center][center].building = Building.village;
        map[center][center + 1].environment = Environment.Field;
        map[center][center + 1].building = Building.barn;

        // Set discovered
        map[center][center].discovered = true;
        map[center][center + 1].discovered = true;
        map[center][center - 1].discovered = true;
        map[center + 1][center].discovered = true;
        map[center - 1][center].discovered = true;

        return map;
    }

    private static Mask(x: number, y: number) {
        let island_size = 60;
        let distance_x = Math.abs(x - island_size * 0.5);
        let distance_y = Math.abs(y - island_size * 0.5);
        let distance = Math.sqrt(distance_x*distance_x + distance_y*distance_y); // square mask

        let max_width = island_size * 0.5 - 2.0;
        let delta = distance / max_width;
        let gradient = delta * delta;

        return Math.max(0.0, 1.0 - gradient);
    }

    private static NoiseHeight(simplex: SimplexNoise, x: number, y: number) {
        return 0.5 + 1 * simplex.noise2D(x*0.05, y*0.05) + 0.25 * simplex.noise2D(x*5, y*5);
    }

    private static NoiseTrees(simplex: SimplexNoise, x: number, y: number) {
        return 0.5 + 1 * simplex.noise2D(x*0.05, y*0.05) ;
    }
}