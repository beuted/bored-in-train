import { Environment } from '@/models/Environment';
import { Building } from '@/models/Building';
import { IMapTile } from '@/models/IMapTile';
import SimplexNoise from 'simplex-noise';

export class MapBuilder {
    private static simplexHeight = new SimplexNoise();
    private static simplexTrees = new SimplexNoise();

    public static InitMap(size: number): IMapTile[][] {
        var center = Math.floor(size/2);
        const mapSize = size;
        // Build Environment and natural Buildings (forests, ...)
        let map: IMapTile[][] = [];
        for (let i = 0; i < mapSize; i++) {
            map[i] = [];
            for (let j = 0; j < mapSize; j++) {
                let env = MapBuilder.GetHeightEnvironment(i, j, size);

                if ((env == Environment.Field || env == Environment.Beach || env == Environment.Concrete) && Math.random() > 0.97)
                    env = MapBuilder.GetDepositeEnvironment();

                let building = MapBuilder.GetBuilding(env, i, j);

                map[i][j] = {
                    building: building,
                    environment: env,
                    discovered: false,
                    discoverable: 0,
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
        map[center][center + 1].discoverable = 1;
        map[center][center - 1].discoverable = 1;
        map[center + 1][center].discoverable = 1;
        map[center - 1][center].discoverable = 1;

        return map;
    }

    private static GetBuilding(env: Environment, i: number, j: number): Building | null {
        if ((env == Environment.Field || env == Environment.Concrete) && MapBuilder.NoiseTrees(i, j) > 0.5) {
            return Building.forest;
        }
        return null;
    }

    private static GetDepositeEnvironment(): Environment {
        var seed = Math.random();
        if (seed < 0.33)
            return Environment.CoalDeposite;
        else if (seed < 0.66)
            return Environment.StoneDeposite;
        else
            return Environment.LimestoneDeposite;
    }

    private static GetHeightEnvironment(i: number, j: number, size: number) : Environment {
        let height = MapBuilder.Mask(i, j, size) * MapBuilder.NoiseHeight(i, j);
        if (height <= 0.01)
            return Environment.Water;
        if (height <= 0.20)
            return Environment.Beach;
        if (height <= 0.75)
            return Environment.Field;
        if (height <= 0.95)
            return Environment.Concrete;

        return Environment.Snow;
    }

    private static Mask(x: number, y: number, size: number) {
        let distance_x = Math.abs(x - size * 0.5);
        let distance_y = Math.abs(y - size * 0.5);
        let distance = Math.sqrt(distance_x*distance_x + distance_y*distance_y); // circle mask

        let max_width = size * 0.5 - 2.0;
        let delta = distance / max_width;
        let gradient = delta * delta;

        return Math.max(0.0, 1.0 - gradient);
    }

    private static NoiseHeight(x: number, y: number) {
        return Math.pow(0.5 + 0.90 * MapBuilder.simplexHeight.noise2D(x*0.05, y*0.05) + 0.10 * MapBuilder.simplexHeight.noise2D(x*0.3, y*0.3), 2);
    }

    private static NoiseTrees(x: number, y: number) {
        return 0.5 + 1 * MapBuilder.simplexTrees.noise2D(x*0.05, y*0.05) ;
    }
}