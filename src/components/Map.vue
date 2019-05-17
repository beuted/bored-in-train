<template>
    <div>
        <div class="menu">
            <span v-if="isKnown('village')">
                <input type="radio" id="village" value="village" v-model="buildingType">
                <label for="village">
                    <PriceTooltip building="village" :consummables="consummables">
                    <div v-once><img v-bind:src="mapTileImages.villageImage.src"></div>
                    </PriceTooltip> x {{ villages.quantity }}
                </label>
            </span>

            <span v-if="isKnown('barn')">
                <input type="radio" id="barn" value="barn" v-model="buildingType" >
                <label for="barn">
                    <PriceTooltip building="barn" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.barnImage.src"></div>
                    </PriceTooltip> x {{ barns.quantity }}
                </label>
            </span>

            <span v-if="isKnown('farm')">
                <input type="radio" id="farm" value="farm" v-model="buildingType">
                <label for="farm">
                    <PriceTooltip building="farm" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.farmImage.src"></div>
                    </PriceTooltip> x {{ farms.quantity }}
                </label>
            </span>

            <span v-if="isKnown('coalMine')">
                <input type="radio" id="coalMine" value="coalMine" v-model="buildingType">
                <label for="coalMine">
                    <PriceTooltip building="coalMine" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.coalMineImage.src"></div>
                    </PriceTooltip> x {{ coalMines.quantity }}
                </label>
            </span>

            <span v-if="isKnown('coalPowerStation')">
                <input type="radio" id="coalPowerStation" value="coalPowerStation" v-model="buildingType">
                <label for="coalPowerStation">
                    <PriceTooltip building="coalPowerStation" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.coalPowerStationImage.src"></div>
                    </PriceTooltip> x {{ coalPowerStations.quantity }}
                </label>
            </span>
        </div>
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

import PriceTooltip from '@/components/PriceTooltip.vue';
import { Research } from '../models/Research';

@Component({
  components: {
      PriceTooltip
  },
})
export default class Map extends IdleGameVue {
    private readonly tileSize = 32;
    private readonly nbTilesOnRowOrColumn = 20;
    private mapTileImages: {
        foretImage: HTMLImageElement,
        waterImage: HTMLImageElement,
        fieldImage: HTMLImageElement,
        villageImage: HTMLImageElement,
        barnImage: HTMLImageElement,
        farmImage: HTMLImageElement,
        coalMineImage: HTMLImageElement,
        coalDepositeImage: HTMLImageElement,
        coalPowerStationImage: HTMLImageElement
    } = {
        foretImage: new Image(),
        waterImage: new Image(),
        fieldImage: new Image(),
        villageImage: new Image(),
        barnImage: new Image(),
        farmImage: new Image(),
        coalMineImage: new Image(),
        coalDepositeImage: new Image(),
        coalPowerStationImage: new Image(),
    }

    @Prop() private map!: IMapTile[][];
    @Prop() private buildings!: { [id in Building]: { quantity: number } };
    @Prop() private consummables!: {[id in Consummable]: { quantity: number }};

    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;

    private mouseTileCoord: { x: number, y: number } | null = null;

    public buildingType: Building = Building.village;

    // Buildings Info
    get villagesInfo() {
        return StaticBuildingInfo.village;
    }

    get barnsInfo() {
        return StaticBuildingInfo.barn;
    }

    get farmsInfo() {
        return StaticBuildingInfo.farm;
    }

    get coalMineInfo() {
        return StaticBuildingInfo.coalMine;
    }

    // Buildings
    get barns() {
        return this.buildings.barn;
    }

    get villages() {
        return this.buildings.village;
    }

    get farms() {
        return this.buildings.farm;
    }

    get coalMines() {
        return this.buildings.coalMine;
    }

    get coalPowerStations() {
        return this.buildings.coalPowerStation;
    }

    // TODO: I'm not sure why I need to watch this property since it's on the store
    @Watch('map', { deep: true })
    onPropertyChanged(value: string, oldValue: string) {
        this.draw();
    }

    constructor() {
        super();
        this.mapTileImages.foretImage.src = './img/foret.png';
        this.mapTileImages.waterImage.src = './img/water.png';
        this.mapTileImages.fieldImage.src = './img/field.png';
        this.mapTileImages.coalDepositeImage.src = './img/coal-deposit.png';
        this.mapTileImages.villageImage.src = './img/village.png';
        this.mapTileImages.barnImage.src = './img/barn.png';
        this.mapTileImages.farmImage.src = './img/farm.png';
        this.mapTileImages.coalMineImage.src = './img/coal-mine.png';
        this.mapTileImages.coalPowerStationImage.src = './img/coal-power-station.png';
    }

    private mounted() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        if (this.map.length <= 0)
            this.$store.commit('InitMap', this.nbTilesOnRowOrColumn);

        var nbImages = Object.keys(this.mapTileImages).length;
        for (const key in this.mapTileImages)
        {
            (this.mapTileImages as any)[key].onload = () => {
                nbImages--;
                if (nbImages == 0)
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
                    this.ctx.drawImage(environmentImage, i*this.tileSize, j*this.tileSize);

                    let buildingImage = this.getBuildingImage(this.map[i][j].building)
                    if (buildingImage)
                        this.ctx.drawImage(buildingImage, i*this.tileSize, j*this.tileSize);
                // The following statement is cached
                } else if (this.$store.getters.tilesDiscoverability[i][j]) {
                    let environmentImage = this.getEnvironmentImage(this.map[i][j].environment);
                    this.ctx.drawImage(environmentImage, i*this.tileSize, j*this.tileSize);
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillRect(i*this.tileSize, j*this.tileSize, i*this.tileSize + 32, j*this.tileSize + 32);
                    this.ctx.globalAlpha = 1;
                } else {
                    this.ctx.fillRect(i*this.tileSize, j*this.tileSize, i*this.tileSize + 32, j*this.tileSize + 32);
                }
            }
        }

        if (this.mouseTileCoord && this.canBeBuilt(this.mouseTileCoord, this.buildingType)) {
            let image = this.getBuildingImage(this.buildingType);
            if (image) {
                this.ctx.globalAlpha = 0.7;
                this.ctx.drawImage(image, this.mouseTileCoord.x*this.tileSize, this.mouseTileCoord.y*this.tileSize);
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

        return true;
    }

    private isKnown(building: Building) {
        return this.$store.getters.researchBuildingsKnown[building];
    }

    private getEnvironmentImage(environment: Environment): HTMLImageElement {
        switch (environment) {
            case Environment.Water:
                return this.mapTileImages.waterImage;
            case Environment.Field:
                return this.mapTileImages.fieldImage;
            case Environment.Forest:
                return this.mapTileImages.foretImage;
            case Environment.CoalDeposite:
                return this.mapTileImages.coalDepositeImage;
        }

        throw new Error(`could not find anything to display for environment ${environment}`);
    }

    private getBuildingImage(building: Building | null): HTMLImageElement | null {
        switch (building) {
            case null:
                return null;
            case Building.village:
                return this.mapTileImages.villageImage;
            case Building.barn:
                return this.mapTileImages.barnImage;
            case Building.farm:
                return this.mapTileImages.farmImage;
            case Building.coalMine:
                return this.mapTileImages.coalMineImage;
            case Building.coalPowerStation:
                return this.mapTileImages.coalPowerStationImage;
        }

        throw new Error(`could not find anything to display for building ${building}`);
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
