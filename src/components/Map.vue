<template>
    <div>
        <div class="menu">
            <span v-for="(building, key) in buildings" v-bind:key="key">
                <span v-if="isKnown(key)">
                    <input type="radio" :id="key" :value="key" v-model="buildingType">
                    <label :for="key">
                        <PriceTooltip :building="key" :consummables="consummables">
                            <span v-once><img v-bind:src="mapBuildingImages[key].src"></span> x {{ building.quantity }}
                        </PriceTooltip>
                    </label>
                </span>
            </span>
            <span v-on:click="showPollution = !showPollution">Pollution</span>
        </div>
        <!--<TileTooltip :tile="map[0][0]"></TileTooltip>-->
        <canvas id="canvas" class="map"
            v-on:mousedown="handleMouseDown"
            v-on:mouseup="handleMouseUp"
            v-on:mousemove="handleMouseMove"
            v-on:mouseout="handleMouseOut"
            :width="canvasSize+'px'" :height="canvasSize+'px'"></canvas>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Building } from '@/models/Building';
import { Habitat } from '@/models/Habitat';
import { StaticBuildingInfo, ResearchInfo } from '@/services/GameEngine'
import { Environment } from '@/models/Environment';
import { IMapTile } from '@/models/IMapTile';
import { IState, IdleGameVue } from '@/store';
import { Consummable } from '@/models/Consummable';
import { Research } from '../models/Research';
import { Keycodes } from '../models/Keycodes';

import PriceTooltip from '@/components/PriceTooltip.vue';
import TileTooltip from '@/components/TileTooltip.vue';
import { KeyboardService } from '../services/KeyboardService';

@Component({
  components: {
      PriceTooltip,
      TileTooltip
  },
})
export default class Map extends IdleGameVue {
    private nbTilesOnRowOrColumnOnScreen = 20;
    private tileSize = 32;

    private readonly nbTilesOnRowOrColumn = 100;
    private readonly canvasSize = this.nbTilesOnRowOrColumnOnScreen * this.tileSize;

    private mapEnvironmentImages: { [id: number]: HTMLImageElement } = {
        [Environment.Water]: new Image(),
        [Environment.Field]: new Image(),
        [Environment.Beach]: new Image(),
        [Environment.Snow]: new Image(),
        [Environment.Concrete]: new Image(),
    };

    private mapBuildingImages: { [id in Building]: HTMLImageElement } = {
        forest: new Image(),
        village: new Image(),
        barn: new Image(),
        farm: new Image(),
        stoneMine: new Image(),
        sawmill: new Image(),
        coalMine: new Image(),
        limestoneMine: new Image(),
        limestoneBrickFactory: new Image(),
        coalPowerStation: new Image(),
    };

    private mapHabitatImages: { [id in number]: HTMLImageElement } = {
        [Habitat.CoalDeposite]: new Image(),
        [Habitat.StoneDeposite]: new Image(),
        [Habitat.LimestoneDeposite]: new Image(),
    };

    @Prop() private map!: IMapTile[][];
    @Prop() private buildings!: { [id in Building]: { quantity: number } };
    @Prop() private consummables!: {[id in Consummable]: { quantity: number }};

    private keyBoardService: KeyboardService;

    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;
    private mapCanvas!: HTMLCanvasElement;
    private mapContext!: CanvasRenderingContext2D;
    private mouseCanvas!: HTMLCanvasElement;
    private mouseContext!: CanvasRenderingContext2D;

    private mouseTileCoord: { x: number, y: number } | null = null;
    // TODO: this should not be init with a neg value... I have screwed up somewhere
    private mapOffset: { x: number, y: number } = {
        x: -Math.floor(this.nbTilesOnRowOrColumn/2 - this.nbTilesOnRowOrColumnOnScreen/2) * this.tileSize,
        y: -Math.floor(this.nbTilesOnRowOrColumn/2 - this.nbTilesOnRowOrColumnOnScreen/2) * this.tileSize
    };
    private isMouseDown = false;
    private draggingStartPoint!: { x: number, y: number };
    private isDragging = true;
    private showPollution = false;
    private animLoop: number = -1;

    public buildingType: Building = Building.village;

    constructor() {
        super();

        this.mapEnvironmentImages[Environment.Water].src = './img/mer.png';
        this.mapEnvironmentImages[Environment.Field].src = './img/field.png';
        this.mapEnvironmentImages[Environment.Beach].src = './img/beach.png';
        this.mapEnvironmentImages[Environment.Snow].src = './img/snow.png';
        this.mapEnvironmentImages[Environment.Concrete].src = './img/concrete.png';
        this.mapBuildingImages[Building.forest].src = './img/foret-2.png';
        this.mapBuildingImages[Building.village].src = './img/village-2.png';
        this.mapBuildingImages[Building.barn].src = './img/entrepot.png';
        this.mapBuildingImages[Building.farm].src = './img/farm.png';
        this.mapBuildingImages[Building.stoneMine].src = './img/minecalcaire.png';
        this.mapBuildingImages[Building.sawmill].src = './img/windmill.png'
        this.mapBuildingImages[Building.coalMine].src = './img/minecharbon.png';
        this.mapBuildingImages[Building.limestoneMine].src = './img/minecalcaire.png';
        this.mapBuildingImages[Building.limestoneBrickFactory].src = './img/limestone-brick-factory.png';
        this.mapBuildingImages[Building.coalPowerStation].src = './img/centralecharbon.png';
        this.mapHabitatImages[Habitat.CoalDeposite].src = './img/coal-deposit.png';
        this.mapHabitatImages[Habitat.StoneDeposite].src = './img/stone-deposit.png';
        this.mapHabitatImages[Habitat.LimestoneDeposite].src = './img/limestone-deposit.png';

        this.keyBoardService = new KeyboardService();
    }

    public isKnown(building: Building) {
        return this.$store.getters.researchBuildingsKnown[building];
    }

    private mounted() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = this.tileSize * this.nbTilesOnRowOrColumn;
        this.mapCanvas.height = this.tileSize * this.nbTilesOnRowOrColumn;
        this.mapContext = <CanvasRenderingContext2D>this.mapCanvas.getContext('2d');
        this.mapContext.imageSmoothingEnabled = false;

        this.mouseCanvas = document.createElement('canvas');
        this.mouseCanvas.width = this.tileSize;
        this.mouseCanvas.height =  this.tileSize;
        this.mouseContext = <CanvasRenderingContext2D>this.mouseCanvas.getContext('2d');
        this.mouseContext.imageSmoothingEnabled = false;

        this.keyBoardService.Start();

        if (this.map.length <= 0)
            this.$store.commit('InitMap', this.nbTilesOnRowOrColumn);

        let nbEnvImages = Object.keys(this.mapEnvironmentImages).length;
        let nbBuildingImages = Object.keys(this.mapBuildingImages).length;

        for (const key in this.mapBuildingImages) {
            (this.mapBuildingImages as any)[key].onload = () => {
                nbBuildingImages--;
                if (nbBuildingImages == 0 && nbEnvImages == 0) {
                    console.log('starting map loop');
                    window.requestAnimationFrame(() => { this.draw(true); this.mapLoop(); });
                }
            }
        }

        for (const key in this.mapEnvironmentImages)
        {
            (this.mapEnvironmentImages as any)[key].onload = () => {
                nbEnvImages--;
                if (nbEnvImages == 0 && nbBuildingImages == 0) {
                    console.log('starting map loop');
                    window.requestAnimationFrame(() => { this.draw(true); this.mapLoop(); });
                }
            }
        }
    }

    private beforeDestroy() {
        window.cancelAnimationFrame(this.animLoop);
    }

    public mapLoop() {
        this.animLoop = window.requestAnimationFrame(() => this.mapLoop());

        this.compute();
        this.draw(false);
    }

    private compute() {
        const keyBoardMapMoveSpeed = 3;
        if (this.keyBoardService.IsKeyPressed(Keycodes.UP_ARROW))
            this.mapOffset.y+=keyBoardMapMoveSpeed;
        else if (this.keyBoardService.IsKeyPressed(Keycodes.DOWN_ARROW))
            this.mapOffset.y-=keyBoardMapMoveSpeed;

        if (this.keyBoardService.IsKeyPressed(Keycodes.RIGHT_ARROW))
            this.mapOffset.x-=keyBoardMapMoveSpeed;
        else if (this.keyBoardService.IsKeyPressed(Keycodes.LEFT_ARROW))
            this.mapOffset.x+=keyBoardMapMoveSpeed;

        const wheelDelta =  this.keyBoardService.GetWheelDelta();
        if (wheelDelta < 0 && this.mouseTileCoord && this.tileSize < 64) {
            // Recenter camera on center tile
            this.mapOffset.x = this.mapOffset.x * 2 - this.canvasSize/2;
            this.mapOffset.y = this.mapOffset.y * 2 - this.canvasSize/2;

            // Resize tiles and map
            this.nbTilesOnRowOrColumnOnScreen /= 2;
            this.tileSize *= 2;

            this.$store.commit('MapNeedsUpdate');
        } else if (wheelDelta > 0 && this.mouseTileCoord && this.tileSize > 8) {
            // Recenter camera on center tile
            this.mapOffset.x = this.mapOffset.x / 2 + this.canvasSize/4;
            this.mapOffset.y = this.mapOffset.y / 2 + this.canvasSize/4;

            // Resize tiles and map
            this.nbTilesOnRowOrColumnOnScreen *= 2;
            this.tileSize /= 2;

            this.$store.commit('MapNeedsUpdate');
        }
        this.keyBoardService.Reset();
    }

    private drawMap() {
        // Refresh canvas layers since their size can have changed
        this.mouseCanvas.width = this.tileSize;
        this.mouseCanvas.height = this.tileSize;
        this.mapCanvas.width = this.tileSize * this.nbTilesOnRowOrColumn;
        this.mapCanvas.height = this.tileSize * this.nbTilesOnRowOrColumn;
        this.mapContext.imageSmoothingEnabled = false;
        this.mouseContext.imageSmoothingEnabled = false;
        this.mapContext.font = Math.floor(this.tileSize/2) + 'px Arial';

        this.mapContext.clearRect(0, 0, this.tileSize * this.nbTilesOnRowOrColumn, this.tileSize * this.nbTilesOnRowOrColumn);
        for (var i = 0; i < this.nbTilesOnRowOrColumn; i++) {
            for (var j = 0; j < this.nbTilesOnRowOrColumn; j++) {
                if (this.map[i][j].discovered) {
                    let environmentImage = this.getEnvironmentImage(this.map[i][j].environment)
                    this.mapContext.drawImage(environmentImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);

                    const building = this.map[i][j].building;
                    const habitat = this.map[i][j].habitat;
                    if (building != null) {
                        let buildingImage = this.getBuildingImage(building);

                        if (this.map[i][j].disabled)
                            this.mapContext.globalAlpha = 0.7;
                        this.mapContext.drawImage(buildingImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                        this.mapContext.globalAlpha = 1;

                        // Show population on the map
                        const quantity = this.map[i][j].quantity;
                        if (quantity > 0)
                            this.mapContext.fillText(quantity+'', i*this.tileSize, (j+0.5)*this.tileSize);

                        const pop = this.map[i][j].population;
                        if (pop > 0)
                            this.mapContext.fillText(pop+'', i*this.tileSize, (j+1)*this.tileSize);
                    } else if (habitat != null) { // If a building is found no need to draw the habitat
                        let habitatImage = this.getHabitatImage(habitat)
                        this.mapContext.drawImage(habitatImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                    }

                    // Pollution
                    if (this.showPollution && this.map[i][j].pollution > 0) {
                        this.mapContext.fillStyle = '#FF0000';

                        this.mapContext.globalAlpha = Math.min(this.map[i][j].pollution / 100, 1);
                        this.mapContext.fillRect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                        this.mapContext.globalAlpha = 1;
                        this.mapContext.fillStyle = '#000000';
                    }

                // The following statement is cached
                } else if (this.$store.state.map.map[i][j].discoverable > 0) {
                    let environmentImage = this.getEnvironmentImage(this.map[i][j].environment);
                    this.mapContext.drawImage(environmentImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);

                    const building = this.map[i][j].building;
                    const habitat = this.map[i][j].habitat;
                    if (building != null) {
                        let buildingImage = this.getBuildingImage(building)
                        this.mapContext.drawImage(buildingImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                    } else if (habitat != null) { // If a building is found no need to draw the habitat
                        let habitatImage = this.getHabitatImage(habitat)
                        this.mapContext.drawImage(habitatImage, i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                    }

                    this.mapContext.globalAlpha = 0.7;
                    this.mapContext.fillRect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
                    this.mapContext.globalAlpha = 1;
                }
            }
        }
    }

    private drawMouse() {
        if (this.mouseTileCoord) {
            this.mouseContext.clearRect(0, 0, this.tileSize, this.tileSize);
            let image = this.getBuildingImage(this.buildingType);
            if (image) {
                this.mouseContext.globalAlpha = 0.7;
                if (!this.canBeBuilt(this.mouseTileCoord, this.buildingType).result) {
                    // Show a red bg when a building can't be built
                    this.mouseContext.fillStyle = '#FF0000';
                    this.mouseContext.fillRect(0, 0, this.tileSize, this.tileSize);
                    this.mouseContext.fillStyle = '#000';
                    //this.mouseContext.globalCompositeOperation = "destination-in";
                }
                this.mouseContext.drawImage(image, 0, 0, this.tileSize, this.tileSize);
                //this.mouseContext.globalCompositeOperation = "source-over";

                this.mouseContext.globalAlpha = 1.0;
            }
        }
    }

    private draw(forced: boolean) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.tileSize * this.nbTilesOnRowOrColumn, this.tileSize * this.nbTilesOnRowOrColumn);

        if (forced || this.$store.state.map.mapNeedsUpdate) {
            this.drawMap();
            this.$store.commit('MapHaveBeenUpdated');
        }

        if (forced || true /*TODO*/) {
            this.drawMouse();
        }

        this.ctx.drawImage(this.mapCanvas, this.mapOffset.x, this.mapOffset.y);
        if (this.mouseTileCoord)
            this.ctx.drawImage(this.mouseCanvas, this.mouseTileCoord.x*this.tileSize + this.mapOffset.x, this.mouseTileCoord.y*this.tileSize + this.mapOffset.y);
    }

    private handleMouseDown(event: MouseEvent) {
        var canvasSize = this.tileSize*this.nbTilesOnRowOrColumn;
        if (event.pageX < canvasSize + this.canvas.offsetLeft && event.pageX > this.canvas.offsetLeft
            && event.pageY < canvasSize + this.canvas.offsetTop && event.pageY > this.canvas.offsetTop) {
                this.isMouseDown = true;
                this.isDragging = true;
                this.draggingStartPoint = { x: event.pageX - this.mapOffset.x, y: event.pageY - this.mapOffset.y }
        }
    }

    private handleMouseUp(event: MouseEvent) {
        var coord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);
        this.isMouseDown = false;

        //Check if this was a drag or a click
        if (this.isDragging) {
            this.tryBuild(coord, this.buildingType);
        }

        this.isDragging = true;
        this.isMouseDown = false;
    }

    private handleMouseOut() {
        this.mouseTileCoord = null;
        this.isMouseDown = false;
    }

    // TODO: could be gathered in the mainLoop
    private handleMouseMove(event: MouseEvent) {
        this.mouseTileCoord = this.getTileFromCoordinate(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);
        if (this.isMouseDown) {
            //var prevMapOffeset = Object.assign({}, this.mapOffset);
            this.mapOffset.x = event.pageX - this.draggingStartPoint.x;
            this.mapOffset.y = event.pageY - this.draggingStartPoint.y;

            if (this.mapOffset.x < (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize)
                this.mapOffset.x = (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize;
            if (this.mapOffset.x > 0)
                this.mapOffset.x = 0;

            if (this.mapOffset.y < (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize)
                this.mapOffset.y = (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize;
            if (this.mapOffset.y > 0)
                this.mapOffset.y = 0;

            // Of a drag happened do not consider it as a click
            this.isDragging = false;
        }
    }

    private tryBuild(coord: { x: number, y: number }, building: Building) {
        const canBeBuilt = this.canBeBuilt(coord, building);
        if (!canBeBuilt.result) {
            Vue.toasted.error(`You cannot build this building here: ${canBeBuilt.reason}`);
            return;
        }

        // Pay the price of your purchase
        for (let consummable in StaticBuildingInfo[building].price) {
            let price = StaticBuildingInfo[building].price[consummable as Consummable];
            if (price && price != 0)
                this.$store.commit('IncrementConsummable', { name: consummable, value: -price });
        }

        this.$store.commit('ChangeTile', { x: coord.x, y: coord.y, type: building });
    }

    private canBeBuilt(coord: { x: number, y: number }, building: Building): {result: boolean, reason: string | null} {
        if (coord.x < 0 || coord.y < 0 || coord.x >= this.nbTilesOnRowOrColumn || coord.y >= this.nbTilesOnRowOrColumn)
            return {result: false, reason: 'This tile is outside the map'};

        // Check if you can afford your purchase
        for (let consummableId in StaticBuildingInfo[this.buildingType].price) {
            let price = StaticBuildingInfo[this.buildingType].price[consummableId as Consummable];

            if (price && this.consummables[consummableId as Consummable].quantity < price)
                return {result: false, reason: `You don't have enough ${consummableId}`};
        }

        // If building is already there
        if (building == this.map[coord.x][coord.y].building)
            return {result: false, reason: `There is already a ${building} here`};

        // If not discovered
        if (!this.map[coord.x][coord.y].discovered)
            return {result: false, reason: `This tile have not been discovered yet`};

        // You can't build on water
        if (this.map[coord.x][coord.y].environment == Environment.Water)
            return {result: false, reason: `You cannot build this on water`};

        // You must build coalMine on coalDeposite
        if (building == Building.coalMine && this.map[coord.x][coord.y].habitat !== Habitat.CoalDeposite)
            return {result: false, reason: `A ${building} must be built on a coal deposite`};

        // You must build stoneMine on stoneDeposite
        if (building == Building.stoneMine && this.map[coord.x][coord.y].habitat !== Habitat.StoneDeposite)
            return {result: false, reason: `A ${building} must be built on a stone deposite`};

        // You must build limestoneMine on limestoneDeposite
        if (building == Building.limestoneMine && this.map[coord.x][coord.y].habitat !== Habitat.LimestoneDeposite)
            return {result: false, reason: `A ${building} must be built on a limestone deposite`};

        // You must build sawmill next to a forest
        if (building == Building.sawmill && this.map[coord.x][coord.y].closeByTrees <= 0)
            return {result: false, reason: `A ${building} must be built next to a forest`};

        return {result: true, reason: null};
    }

    private getEnvironmentImage(environment: Environment): HTMLImageElement {
        return this.mapEnvironmentImages[environment];
    }

    private getBuildingImage(building: Building): HTMLImageElement {
        return this.mapBuildingImages[building];
    }

    private getHabitatImage(habitat: Habitat): HTMLImageElement {
        return this.mapHabitatImages[habitat];
    }

    private getTileFromCoordinate(x: number, y: number) {
        return {
            x: Math.floor((x-this.mapOffset.x)/this.tileSize),
            y: Math.floor((y-this.mapOffset.y)/this.tileSize)
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
