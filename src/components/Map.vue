<template>
    <div>
        <canvas id="canvas" class="map"
            v-on:mousedown="handleMouseDown"
            v-on:mouseup="handleMouseUp"
            v-on:mousemove="handleMouseMove"
            :width="nbTilesOnRowOrColumn*tileSize+'px'" :height="nbTilesOnRowOrColumn*tileSize+'px'"></canvas>
        <div>
            <h2>What to build ?</h2>
            <input type="radio" id="house" value="houses" v-model="buildingType">
            <label for="house" v-once><PriceTooltip v-once :priceStruct="housesInfo.price">House</PriceTooltip></label>
            <input type="radio" id="barn" value="barns" v-model="buildingType">
            <label for="barn"><PriceTooltip v-once :priceStruct="barnsInfo.price">Barn</PriceTooltip></label>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Building, StorageToBuildingMapping } from '@/models/Building';
import { StaticStorageInfo, storage } from '@/store';
import PriceTooltip from '@/components/PriceTooltip.vue';

@Component({
  components: {
      PriceTooltip
  },
})
export default class Map extends Vue {
    private readonly tileSize = 32;
    private readonly nbTilesOnRowOrColumn = 20;
    private mapTileImages: {[id: number]: HTMLImageElement} = {}
    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;

    public buildingType: storage = storage.houses;

    get housesInfo() {
        return StaticStorageInfo.houses;
    }

    get barnsInfo() {
        return StaticStorageInfo.barns;
    }

    private mounted() {
        var foret = new Image(); foret.src = './img/foret.png';
        var water = new Image(); water.src = './img/water.png';
        var field = new Image(); field.src = './img/field.png';
        var city = new Image(); city.src = './img/city.png';
        var barn = new Image(); barn.src = './img/barn.png';
        var farm = new Image(); farm.src = './img/farm.png';

        this.mapTileImages = {
            0: foret,
            1: water,
            2: field,
            3: city,
            4: barn,
            5: farm,
        };

        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        this.$store.commit('InitMap', this.nbTilesOnRowOrColumn);

        var nbImages = Object.keys(this.mapTileImages).length;
        for (const key in this.mapTileImages)
        {
            this.mapTileImages[key].onload = () => {
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
                this.ctx.drawImage(this.mapTileImages[this.$store.state.map[i][j]], i*this.tileSize, j*this.tileSize);
            }
        }
    }

    private handleMouseDown(event: MouseEvent) {
        var coord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);

        if (coord.x < 0 || coord.y < 0 || coord.x >= this.nbTilesOnRowOrColumn || coord.y >= this.nbTilesOnRowOrColumn)
            return;

        if (this.$store.state['sticks'].quantity < 10)
            return;

        // Check if you can afford your purchase
        for (let consummable in (StaticStorageInfo as any)[this.buildingType].price) {
            let price = (StaticStorageInfo as any)[this.buildingType].price[consummable];

            if (price && this.$store.state[consummable].quantity < price)
                return;
        }

        // If building is already there
        if (StorageToBuildingMapping[this.buildingType] == this.$store.state.map[coord.x][coord.y])
            return;

        // You can't build on water
        if (this.$store.state.map[coord.x][coord.y] == Building.Water)
            return;

        // Pay the price of your purchase
        for (let consummable in (StaticStorageInfo as any)[this.buildingType].price) {
            let price = (StaticStorageInfo as any)[this.buildingType].price[consummable];
            if (price && price != 0)
                this.$store.commit('Increment', { name: consummable, value: -price });
        }

        this.$store.commit('ChangeTile', { x: coord.x, y: coord.y, type: StorageToBuildingMapping[this.buildingType] });

        this.draw();
    }

    private handleMouseUp() {

    }

    private handleMouseMove() {

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
