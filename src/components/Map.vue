<template>
    <div>
        <canvas id="canvas" class="map"
            v-on:mousedown="handleMouseDown"
            v-on:mouseup="handleMouseUp"
            v-on:mousemove="handleMouseMove"
            :width="nbTilesOnRowOrColumn*tileSize+'px'" :height="nbTilesOnRowOrColumn*tileSize+'px'"></canvas>
        <div>
            <h2>What to build ?</h2>
            <input type="radio" id="village" value="villages" v-model="storageType">
            <label for="village" v-once><PriceTooltip v-once :priceStruct="villagesInfo.price">Village</PriceTooltip></label>
            <input type="radio" id="barn" value="barns" v-model="storageType">
            <label for="barn"><PriceTooltip v-once :priceStruct="barnsInfo.price">Barn</PriceTooltip></label>
            <input type="radio" id="farm" value="farms" v-model="storageType">
            <label for="farm"><PriceTooltip v-once :priceStruct="farmsInfo.price">Farm</PriceTooltip></label>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Building, StorageToBuildingMapping } from '@/models/Building';
import { Storage } from '@/models/Storage';
import { StaticStorageInfo } from '@/services/GameEngine'
import PriceTooltip from '@/components/PriceTooltip.vue';
import { Environment } from '@/models/Environment';
import { IMapTile } from '@/models/IMapTile';
import { IState } from '@/store';

@Component({
  components: {
      PriceTooltip
  },
})
export default class Map extends Vue {
    private readonly tileSize = 32;
    private readonly nbTilesOnRowOrColumn = 20;
    private mapTileImages: {
        foretImage: HTMLImageElement,
        waterImage: HTMLImageElement,
        fieldImage: HTMLImageElement,
        villageImage: HTMLImageElement,
        barnImage: HTMLImageElement,
        farmImage: HTMLImageElement
    } = {
        foretImage: new Image(),
        waterImage: new Image(),
        fieldImage: new Image(),
        villageImage: new Image(),
        barnImage: new Image(),
        farmImage: new Image()
    }
    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;

    public storageType: Storage = Storage.villages;

    get villagesInfo() {
        return StaticStorageInfo.villages;
    }

    get barnsInfo() {
        return StaticStorageInfo.barns;
    }

    get farmsInfo() {
        return StaticStorageInfo.farms;
    }

    private mounted() {
        this.mapTileImages.foretImage.src = './img/foret.png';
        this.mapTileImages.waterImage.src = './img/water.png';
        this.mapTileImages.fieldImage.src = './img/field.png';
        this.mapTileImages.villageImage.src = './img/village.png';
        this.mapTileImages.barnImage.src = './img/barn.png';
        this.mapTileImages.farmImage.src = './img/farm.png';
        
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
    }

    private handleMouseDown(event: MouseEvent) {
        var buildingType = StorageToBuildingMapping[this.storageType];
        var coord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);

        if (coord.x < 0 || coord.y < 0 || coord.x >= this.nbTilesOnRowOrColumn || coord.y >= this.nbTilesOnRowOrColumn)
            return;

        // Check if you can afford your purchase
        for (let consummableId in (StaticStorageInfo as any)[this.storageType].price) {
            let price = (StaticStorageInfo as any)[this.storageType].price[consummableId];

            if (price && ((this.$store.state as IState).consummable as any)[consummableId].quantity < price)
                return;
        }

        // If building is already there
        if (buildingType == (this.$store.state as IState).map[coord.x][coord.y].building)
            return;

        // You can't build on water
        if ((this.$store.state as IState).map[coord.x][coord.y].environment == Environment.Water)
            return;

        // Pay the price of your purchase
        for (let consummable in (StaticStorageInfo as any)[this.storageType].price) {
            let price = (StaticStorageInfo as any)[this.storageType].price[consummable];
            if (price && price != 0)
                this.$store.commit('IncrementConsummable', { name: consummable, value: -price });
        }

        this.$store.commit('ChangeTile', { x: coord.x, y: coord.y, type: buildingType });

        this.draw();
    }

    private handleMouseUp() {

    }

    private handleMouseMove() {

    }

    private getImageToDisplay(mapTile: IMapTile): HTMLImageElement {
        if (mapTile.building != Building.NoBuilding) {
            switch (mapTile.building) {
                case Building.Village:
                    return this.mapTileImages.villageImage;
                case Building.Barn:
                    return this.mapTileImages.barnImage;
                case Building.Farm:
                    return this.mapTileImages.farmImage;
            }
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
</style>
