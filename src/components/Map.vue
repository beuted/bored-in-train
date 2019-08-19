<template>
    <div>
        <div class="menu">
            <span v-for="(building, key) in buildings" v-bind:key="key">
                <span v-if="isKnown(key)">
                    <input type="radio" :id="key" :value="key" v-model="buildingType">
                    <label :for="key">
                        <PriceTooltip :building="key" :consummables="consummables">
                            <div v-once><img v-bind:src="mapBuildingImages[key].src"></div>
                        </PriceTooltip> x {{ building.quantity }}
                    </label>
                </span>
            </span>
        </div>
        <!--<TileTooltip :tile="map[0][0]"></TileTooltip>-->
        <canvas id="canvas" class="map"
            v-on:mousedown="handleMouseDown"
            v-on:mouseup="handleMouseUp"
            v-on:mousemove="handleMouseMove"
            v-on:mouseout="handleMouseOut"
            :width="nbTilesOnRowOrColumn*tileSize+'px'" :height="nbTilesOnRowOrColumn*tileSize+'px'"></canvas>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Building } from '@/models/Building';
import { StaticBuildingInfo, ResearchInfo } from '@/services/GameEngine'
import { Environment } from '@/models/Environment';
import { IMapTile } from '@/models/IMapTile';
import { IState, IdleGameVue } from '@/store';
import { Consummable } from '@/models/Consummable';
import { Research } from '../models/Research';

import PriceTooltip from '@/components/PriceTooltip.vue';
import TileTooltip from '@/components/TileTooltip.vue';

@Component({
  components: {
      PriceTooltip,
      TileTooltip
  },
})
export default class Map extends IdleGameVue {
    private readonly tileSize = 32;
    private readonly nbTilesOnRowOrColumn = 20;
    private mapEnvironmentImages: { [id: number]: HTMLImageElement } = {
        [Environment.Water]: new Image(),
        [Environment.Field]: new Image(),
        [Environment.CoalDeposite]: new Image(),
        [Environment.StoneDeposite]: new Image(),
        [Environment.Beach]: new Image(),
    };

    private mapBuildingImages: { [id in Building]: HTMLImageElement } = {
        forest: new Image(),
        village: new Image(),
        barn: new Image(),
        farm: new Image(),
        coalMine: new Image(),
        coalPowerStation: new Image(),
        stoneMine: new Image(),
    }

    @Prop() private map!: IMapTile[][];
    @Prop() private buildings!: { [id in Building]: { quantity: number } };
    @Prop() private consummables!: {[id in Consummable]: { quantity: number }};

    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;

    private mouseTileCoord: { x: number, y: number } | null = null;

    public buildingType: Building = Building.village;

    // TODO: I'm not sure why I need to watch this property since it's on the store
    @Watch('map', { deep: true })
    onPropertyChanged(value: string, oldValue: string) {
        this.draw();
    }

    constructor() {
        super();
        this.mapEnvironmentImages[Environment.Water].src = './img/mer.png';
        this.mapEnvironmentImages[Environment.Field].src = './img/field.png';
        this.mapEnvironmentImages[Environment.CoalDeposite].src = './img/coal-deposit.png';
        this.mapEnvironmentImages[Environment.StoneDeposite].src = './img/stone-deposit.png';
        this.mapEnvironmentImages[Environment.Beach].src = './img/beach.png';
        this.mapBuildingImages[Building.forest].src = './img/foret-2.png';
        this.mapBuildingImages[Building.village].src = './img/village-2.png';
        this.mapBuildingImages[Building.barn].src = './img/entrepot.png';
        this.mapBuildingImages[Building.farm].src = './img/farm.png';
        this.mapBuildingImages[Building.coalMine].src = './img/minecharbon.png';
        this.mapBuildingImages[Building.coalPowerStation].src = './img/centralecharbon.png';
        this.mapBuildingImages[Building.stoneMine].src = './img/minecalcaire.png';
    }

    public isKnown(building: Building) {
        return this.$store.getters.researchBuildingsKnown[building];
    }

    private mounted() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        if (this.map.length <= 0)
            this.$store.commit('InitMap', this.nbTilesOnRowOrColumn);

        let nbEnvImages = Object.keys(this.mapEnvironmentImages).length;
        let nbBuildingImages = Object.keys(this.mapBuildingImages).length;

        for (const key in this.mapBuildingImages)
        {
            (this.mapBuildingImages as any)[key].onload = () => {
                nbBuildingImages--;
                if (nbBuildingImages == 0 && nbEnvImages == 0)
                    this.draw();
            }
        }

        for (const key in this.mapEnvironmentImages)
        {
            (this.mapEnvironmentImages as any)[key].onload = () => {
                nbEnvImages--;
                if (nbEnvImages == 0 && nbBuildingImages == 0)
                    this.draw();
            }
        }
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.tileSize * this.nbTilesOnRowOrColumn, this.tileSize * this.nbTilesOnRowOrColumn);

        for (var i = 0; i < this.nbTilesOnRowOrColumn; i++) {
            for (var j = 0; j < this.nbTilesOnRowOrColumn; j++) {
                if (this.map[i][j].discovered) {
                    let environmentImage = this.getEnvironmentImage(this.map[i][j].environment)
                    this.ctx.drawImage(environmentImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);

                    let buildingImage = this.getBuildingImage(this.map[i][j].building)
                    if (buildingImage)
                        this.ctx.drawImage(buildingImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                // The following statement is cached
                } else if (this.$store.getters.tilesDiscoverability[i][j]) {
                    let environmentImage = this.getEnvironmentImage(this.map[i][j].environment);
                    this.ctx.drawImage(environmentImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);

                    let buildingImage = this.getBuildingImage(this.map[i][j].building)
                    if (buildingImage)
                        this.ctx.drawImage(buildingImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);

                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillRect(i*this.tileSize, j*this.tileSize, (i+1)*this.tileSize, (j+1)*this.tileSize);
                    this.ctx.globalAlpha = 1;
                } else {
                    this.ctx.fillRect(i*this.tileSize, j*this.tileSize, (i+1)*this.tileSize, (j+1)*this.tileSize);
                }
            }
        }

        if (this.mouseTileCoord && this.canBeBuilt(this.mouseTileCoord, this.buildingType)) {
            let image = this.getBuildingImage(this.buildingType);
            if (image) {
                this.ctx.globalAlpha = 0.7;
                this.ctx.drawImage(image, this.mouseTileCoord.x*this.tileSize, this.mouseTileCoord.y*this.tileSize, this.tileSize, this.tileSize);
                this.ctx.globalAlpha = 1.0;
            }
        }
    }

    private handleMouseDown(event: MouseEvent) {
        var coord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);

        if (!this.canBeBuilt(coord, this.buildingType))
            return;

        // Pay the price of your purchase
        for (let consummable in StaticBuildingInfo[this.buildingType].price) {
            let price = StaticBuildingInfo[this.buildingType].price[consummable as Consummable];
            if (price && price != 0)
                this.$store.commit('IncrementConsummable', { name: consummable, value: -price });
        }

        this.$store.commit('ChangeTile', { x: coord.x, y: coord.y, type: this.buildingType });

        this.draw();
    }

    private handleMouseUp() {

    }

    private handleMouseOut() {
        this.mouseTileCoord = null;
        this.draw();
    }

    private handleMouseMove(event: MouseEvent) {
        this.mouseTileCoord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);
        this.draw();
    }

    private canBeBuilt(coord: { x: number, y: number }, building: Building) {
        if (coord.x < 0 || coord.y < 0 || coord.x >= this.nbTilesOnRowOrColumn || coord.y >= this.nbTilesOnRowOrColumn)
            return false;

        // Check if you can afford your purchase
        for (let consummableId in StaticBuildingInfo[this.buildingType].price) {
            let price = StaticBuildingInfo[this.buildingType].price[consummableId as Consummable];

            if (price && this.consummables[consummableId as Consummable].quantity < price)
                return false;
        }

        // If building is already there
        if (building == this.map[coord.x][coord.y].building)
            return false;

        // If not discovered
        if (!this.map[coord.x][coord.y].discovered)
            return false;

        // You can't build on water
        if (this.map[coord.x][coord.y].environment == Environment.Water)
            return false;

        // You must build coalMine on coalDeposite
        if (building == Building.coalMine && this.map[coord.x][coord.y].environment !== Environment.CoalDeposite)
            return false;

        // You must build stoneMine on stoneDeposite
        if (building == Building.stoneMine && this.map[coord.x][coord.y].environment !== Environment.StoneDeposite)
            return false;

        return true;
    }

    private getEnvironmentImage(environment: Environment): HTMLImageElement {
        return this.mapEnvironmentImages[environment];
    }

    private getBuildingImage(building: Building | null): HTMLImageElement | null {
        if (building == null)
            return null;

        return this.mapBuildingImages[building];
    }

    private getTileFromCoordinate(x: number, y: number) {
        return {
            x: Math.floor(x/this.tileSize),
            y: Math.floor(y/this.tileSize)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.map {
    margin: auto;
}

.menu {
    margin: 20px;
}

input {
    visibility:hidden;
    width:0;
    height:0;
    margin:0;
}
label {
    cursor: pointer;
    margin: 0 10px 0 10px;
}
input:checked + label {
    border-bottom: 3px solid red;
}
</style>
