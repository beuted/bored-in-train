import { Environment } from '@/models/Environment';
import { Building } from '@/models/Building';
import { IMapTile } from '@/models/IMapTile';

export class MapBuilder {
    private static Environments: Environment[][] = [
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4 ],
        [ 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 2 ],
        [ 1, 1, 4, 4, 3, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2 ],
        [ 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2 ],
        [ 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
        [ 1, 1, 1, 2, 5, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
        [ 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 1, 2, 5, 2 ],
        [ 1, 1, 2, 2, 2, 2, 2, 1, 2, 3, 5, 2, 2, 2, 2, 2, 1, 2, 2, 2 ],
        [ 1, 1, 2, 2, 2, 2, 5, 1, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2 ],
        [ 1, 1, 2, 3, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2 ],
        [ 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 2, 2 ],
        [ 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
        [ 1, 1, 2, 2, 2, 1, 1, 2, 6, 2, 5, 2, 2, 2, 3, 2, 2, 2, 2, 2 ],
        [ 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2 ],
        [ 1, 1, 1, 1, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
        [ 1, 2, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2 ],
        [ 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2 ],
        [ 1, 2, 1, 1, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 2 ],
        [ 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ]
    ];

    private static Forest: number[][] = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
        [ 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
        [ 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
        [ 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
        [ 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1 ],
        [ 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1 ],
        [ 0, 1, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1 ],
        [ 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1 ],
        [ 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
    ];

    public static InitMap(size: number): IMapTile[][] {
        var center = Math.floor(size/2);

        // Build Environment and natural Buildings (forests, ...)
        let map: IMapTile[][] = [];
        for (let i = 0; i < MapBuilder.Environments.length; i++) {
            map[i] = [];
            for (let j = 0; j < MapBuilder.Environments.length; j++) {
                map[i][j] = {
                    building: (MapBuilder.Forest[i][j] === 1 && (MapBuilder.Environments[i][j] == 2 || MapBuilder.Environments[i][j] == 4)) ? Building.forest: null,
                    environment: MapBuilder.Environments[i][j],
                    discovered: false
                };
            }
        }

        // Build buildings
        map[center][center].building = Building.village;
        map[center][center + 1].building = Building.barn;

        // Set discovered
        map[center][center].discovered = true;
        map[center][center + 1].discovered = true;
        map[center][center - 1].discovered = true;
        map[center + 1][center].discovered = true;
        map[center - 1][center].discovered = true;

        return map;
    }
}