import { Environment } from '@/models/Environment';
import { Building } from '@/models/Building';
import { IMapTile } from '@/models/IMapTile';

export class MapBuilder {
    private static Environments: Environment[][] = [
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
        [ 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2 ],
        [ 1, 1, 2, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2 ],
        [ 1, 1, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2 ],
        [ 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
        [ 1, 1, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0 ],
        [ 1, 1, 1, 1, 2, 0, 2, 2, 2, 0, 0, 0, 0, 3, 0, 2, 1, 2, 0, 2 ],
        [ 1, 1, 0, 0, 0, 0, 0, 1, 2, 3, 2, 0, 0, 0, 0, 2, 1, 2, 0, 2 ],
        [ 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2 ],
        [ 1, 1, 0, 3, 0, 0, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
        [ 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0 ],
        [ 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0 ],
        [ 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0 ],
        [ 1, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0 ],
        [ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0 ],
        [ 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];

    public static InitMap(size: number): IMapTile[][] {
        var map = this.Environments.map(x => x.map(y => { return { building: 0, environment: y, discovered: false }}));
        var center = Math.floor(size/2);

        // Build buildings
        map[center][center].building = Building.Village;
        map[center][center + 1].building = Building.Barn;

        // Set discovered
        map[center][center].discovered = true;
        map[center][center + 1].discovered = true;
        map[center][center - 1].discovered = true;
        map[center + 1][center].discovered = true;
        map[center - 1][center].discovered = true;

        return map;
    }
}