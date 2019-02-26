<template>
    <div>
        <canvas id="canvas" class="map"
            v-on:mousedown="handleMouseDown"
            v-on:mouseup="handleMouseUp"
            v-on:mousemove="handleMouseMove"
            :width="size+'px'" :height="size+'px'"></canvas>
        <div>
            <h2>What to build ?</h2>
            <input type="radio" id="house" value="1" v-model="buildingType">
            <label for="house">House  ({{ housesInfo.price }})</label>
            <input type="radio" id="barn" value="2" v-model="buildingType">
            <label for="barn">Barn  ({{ barnsInfo.price }})</label>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Building } from '@/models/Building';
import { StaticStorageInfo } from '@/store';

@Component({
  components: {
  },
})
export default class Map extends Vue {
    private size = 600;
    private nbTilesOnRowOrColumn = 15;
    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;

    public buildingType: Building = Building.House;

    get housesInfo() {
        return StaticStorageInfo.houses;
    }

    get barnsInfo() {
        return StaticStorageInfo.barns;
    }

    private mounted() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        this.$store.commit('InitMap', this.nbTilesOnRowOrColumn);

        this.draw();
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.size, this.size);
        
        var tileSize = this.size / this.nbTilesOnRowOrColumn;
        for (var i = 0; i < this.nbTilesOnRowOrColumn; i++) {
            for (var j = 0; j < this.nbTilesOnRowOrColumn; j++) {
                this.ctx.fillStyle = this.getColor(this.$store.state.map[i][j]);
                this.ctx.fillRect(i*tileSize, j*tileSize, (i+1)*tileSize, (j+1)*tileSize);

                this.ctx.strokeStyle = 'back';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(i*tileSize, j*tileSize, (i+1)*tileSize, (j+1)*tileSize);
            }   
        }   
    }

    private getColor(building: Building): string {
        switch(building) {
            case Building.House: return 'gray';
            case Building.Barn: return 'orange';
        }
        return 'green';
    }

    private handleMouseDown(event: MouseEvent) {
        var coord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);

        if (coord.x < 0 || coord.y < 0 || coord.x >= this.nbTilesOnRowOrColumn || coord.y >= this.nbTilesOnRowOrColumn)
            return;
        
        if (this.$store.state['sticks'].quantity < 10)
            return;
        
        this.$store.commit('Increment', { name: 'sticks', value: -10 });
        this.$store.commit('ChangeTile', { x: coord.x, y: coord.y, type: +this.buildingType });
        this.draw();
    }
    
    private handleMouseUp() {
        
    }
    
    private handleMouseMove() {
        
    }

    private getTileFromCoordinate(x: number, y: number) {
        var factor = (this.nbTilesOnRowOrColumn/this.size);
        return {
            x: Math.floor(x*factor),
            y: Math.floor(y*factor)
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
