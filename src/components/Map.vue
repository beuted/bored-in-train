<template>
    <div>
        <canvas id="canvas" class="map"
            v-on:mousedown="handleMouseDown"
            v-on:mouseup="handleMouseUp"
            v-on:mousemove="handleMouseMove"
            v-on:mouseout="handleMouseOut"
            :width="nbTilesOnRowOrColumn*tileSize+'px'" :height="nbTilesOnRowOrColumn*tileSize+'px'"></canvas>
        <div>
            <h2>What to build ?</h2>

            <div class="menu">
                <input type="radio" id="village" value="villages" v-model="storageType">
                <label for="village">
                    <PriceTooltip :priceStruct="villagesInfo.price" :consummables="consummables">
                    <div v-once><img v-bind:src="mapTileImages.villageImage.src"></img></div>
                    </PriceTooltip>
                </label>

                <input type="radio" id="barn" value="barns" v-model="storageType" >
                <label for="barn">
                    <PriceTooltip :priceStruct="barnsInfo.price" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.barnImage.src"></div>
                    </PriceTooltip>
                </label>

                <input type="radio" id="farm" value="farms" v-model="storageType">
                <label for="farm">
                    <PriceTooltip :priceStruct="farmsInfo.price" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.farmImage.src"></div>
                    </PriceTooltip>
                </label>

                <input type="radio" id="coalMine" value="coalMines" v-model="storageType">
                <label for="coalMine">
                    <PriceTooltip :priceStruct="coalMineInfo.price" :consummables="consummables">
                        <div v-once><img v-bind:src="mapTileImages.coalMineImage.src"></div>
                    </PriceTooltip>
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Building, StorageToBuildingMapping } from '@/models/Building';
import { Storage } from '@/models/Storage';
import { StaticStorageInfo } from '@/services/GameEngine'
import { Environment } from '@/models/Environment';
import { IMapTile } from '@/models/IMapTile';
import { IState, IdleGameVue } from '@/store';
import { Consummable } from '@/models/Consummable';

import PriceTooltip from '@/components/PriceTooltip.vue';

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
    } = {
        foretImage: new Image(),
        waterImage: new Image(),
        fieldImage: new Image(),
        villageImage: new Image(),
        barnImage: new Image(),
        farmImage: new Image(),
        coalMineImage: new Image(),
    }
    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;

    private mouseTileCoord: { x: number, y: number } | null = null;

    public storageType: Storage = Storage.villages;

    get consummables() {
        return this.$store.state.consummable;
    }

    get villagesInfo() {
        return StaticStorageInfo.villages;
    }

    get barnsInfo() {
        return StaticStorageInfo.barns;
    }

    get farmsInfo() {
        return StaticStorageInfo.farms;
    }

    get coalMineInfo() {
        return StaticStorageInfo.coalMines;
    }

    constructor() {
        super();
        this.mapTileImages.foretImage.src = './img/foret.png';
        this.mapTileImages.waterImage.src = './img/water.png';
        this.mapTileImages.fieldImage.src = './img/field.png';
        this.mapTileImages.villageImage.src = './img/village.png';
        this.mapTileImages.barnImage.src = './img/barn.png';
        this.mapTileImages.farmImage.src = './img/farm.png';
        this.mapTileImages.coalMineImage.src = './img/coal-mine.png';
    }

    private mounted() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        if ((this.$store.state as IState).map.length <= 0)
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
                var image = this.getImageToDisplay(this.$store.state.map[i][j])
                this.ctx.drawImage(image, i*this.tileSize, j*this.tileSize);
            }
        }

        if (this.mouseTileCoord && this.canBeBuilt(this.mouseTileCoord, StorageToBuildingMapping[this.storageType])) {
            var image = this.getBuildingImage(StorageToBuildingMapping[this.storageType]);
            this.ctx.globalAlpha = 0.7;
            this.ctx.drawImage(image, this.mouseTileCoord.x*this.tileSize, this.mouseTileCoord.y*this.tileSize);
            this.ctx.globalAlpha = 1.0;
        }
    }

    private handleMouseDown(event: MouseEvent) {
        var buildingType = StorageToBuildingMapping[this.storageType];
        var coord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);

        if (!this.canBeBuilt(coord, buildingType))
            return;

        // Pay the price of your purchase
        for (let consummable in StaticStorageInfo[this.storageType as Storage].price) {
            let price = StaticStorageInfo[this.storageType as Storage].price[consummable as Consummable];
            if (price && price != 0)
                this.$store.commit('IncrementConsummable', { name: consummable, value: -price });
        }

        this.$store.commit('ChangeTile', { x: coord.x, y: coord.y, type: buildingType });

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
        for (let consummableId in StaticStorageInfo[this.storageType as Storage].price) {
            let price = StaticStorageInfo[this.storageType].price[consummableId as Consummable];

            if (price && (this.$store.state as IState).consummable[consummableId as Consummable].quantity < price)
                return false;
        }

        // If building is already there
        if (building == (this.$store.state as IState).map[coord.x][coord.y].building)
            return false;

        // You can't build on water
        if ((this.$store.state as IState).map[coord.x][coord.y].environment == Environment.Water)
            return false;

        return true;
    }

    private getImageToDisplay(mapTile: IMapTile): HTMLImageElement {
        if (mapTile.building != Building.NoBuilding) {
            return this.getBuildingImage(mapTile.building);
        }

        switch (mapTile.environment) {
            case Environment.Water:
                return this.mapTileImages.waterImage;
            case Environment.Field:
                return this.mapTileImages.fieldImage;
            case Environment.Forest:
                return this.mapTileImages.foretImage;
        }

        throw new Error(`could not find anything to display for mapTile ${mapTile}`);
    }

    private getBuildingImage(building: Building): HTMLImageElement {
        switch (building) {
            case Building.Village:
                return this.mapTileImages.villageImage;
            case Building.Barn:
                return this.mapTileImages.barnImage;
            case Building.Farm:
                return this.mapTileImages.farmImage;
            case Building.CoalMine:
                return this.mapTileImages.coalMineImage;
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
