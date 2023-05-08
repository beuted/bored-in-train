<template>
  <div>
    <TileTooltip
      :tile="tooltipTile"
      :coord="tooltipCoord"
      :tileCoord="tooltipTileCoord"
      v-on:delete-building="deleteBuilding"
    ></TileTooltip>
    <div
      class="particle-container"
      v-if="shouldShowParticles()"
      :style="{
        left: `${
          lastMouseTileCoord ? lastMouseTileCoord.x * tileSize + mapOffset.x : 0
        }px`,
        top: `${
          lastMouseTileCoord
            ? (lastMouseTileCoord.y - 0.5) * tileSize + mapOffset.y
            : 0
        }px`,
      }"
    >
      <img
        class="particle"
        :src="getConsumableIcon()"
        v-for="(particle, i) of new Array(10)"
        v-bind:key="i"
        :style="{
          transform: `translate(${200 * Math.random() - 100 + 100}px, ${
            200 * Math.random() - 100 + 100
          }px)`,
          'animation-duration': 0.5 * Math.random() + 0.3 + 's',
          'animation-delay': 0 + 's',
        }"
      />
    </div>
    <div v-if="showCursorHelp" class="cursor-help">
      <img src="img/cursors/cursor-gif.gif" />
    </div>
    <canvas
      id="canvas"
      class="map"
      :class="{
        'cursor-grabbing': showDraggingHand,
        'cursor-pointing': building != null,
      }"
      v-on:mousedown="handleMouseDown"
      v-on:touchstart="handleTouchStart"
      v-on:mouseup="handleMouseUp"
      v-on:touchend="handleTouchEnd"
      v-on:mousemove="handleMouseMove"
      v-on:touchmove="handleTouchMove"
      v-on:mouseout="handleMouseOut"
      :width="canvasSize + 'px'"
      :height="canvasSize + 'px'"
      oncontextmenu="return false;"
    ></canvas>
    <div v-if="debugMode" v-on:click="showPollution = !showPollution">
      Show Pollution
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Building } from "@/models/Building";
import {
  StaticBuildingInfo,
  ResearchInfo,
  StaticConsumableInfo,
} from "@/services/GameEngine";
import { Environment } from "@/models/Environment";
import { IMapTile } from "@/models/IMapTile";
import { IState, IdleGameVue } from "@/store";
import { Consumable } from "@/models/Consumable";
import { Research } from "../models/Research";
import { Keycodes } from "../models/Keycodes";

import TileTooltip from "@/components/TileTooltip.vue";
import ShopMenu from "@/components/ShopMenu.vue";
import { KeyboardService } from "../services/KeyboardService";
import { imageService } from "../services/ImageService";
import { map, MapSize } from "../store/mapStoreModule";
import { EventBus } from "@/EventBus";

@Component({
  components: {
    TileTooltip,
  },
})
export default class Map extends IdleGameVue {
  private nbTilesOnRowOrColumnOnScreen = 20;
  public tileSize = 32;
  private zoom = Number((window as any).zoomFactor);

  public readonly canvasSize =
    this.nbTilesOnRowOrColumnOnScreen * this.tileSize;

  private map!: IMapTile[][];
  @Prop() private buildings!: { [id in Building]: { quantity: number } };
  @Prop() public building!: Building | null; // The selected building
  @Prop() private consumables!: { [id in Consumable]: { quantity: number } };

  private keyBoardService: KeyboardService;

  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private mapCanvas!: HTMLCanvasElement;
  private mapContext!: CanvasRenderingContext2D;
  private mouseCanvas!: HTMLCanvasElement;
  private mouseContext!: CanvasRenderingContext2D;

  public mouseTileCoord: { x: number; y: number } | null = null;
  public lastMouseTileCoord: { x: number; y: number } = { x: 0, y: 0 };
  // TODO: this should not be init with a neg value... I have screwed up somewhere
  public mapOffset: { x: number; y: number } = {
    x:
      -Math.floor(MapSize / 2 - this.nbTilesOnRowOrColumnOnScreen / 2) *
      this.tileSize,
    y:
      -Math.floor(MapSize / 2 - this.nbTilesOnRowOrColumnOnScreen / 2) *
      this.tileSize,
  };
  public isMouseDown = false;
  private draggingStartPoint!: { x: number; y: number };
  public isDragging = true;
  public showDraggingHand = false;
  public showPollution = false;
  private animLoop: number = -1;
  public tooltipCoord = { x: 0, y: 0 };
  public tooltipTileCoord = { x: 0, y: 0 };
  public tooltipTile: IMapTile | null = null;
  public showCursorHelp = true;

  constructor() {
    super();

    this.keyBoardService = new KeyboardService();
  }

  public mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.mapCanvas = document.createElement("canvas");
    this.mapCanvas.width = this.tileSize * MapSize;
    this.mapCanvas.height = this.tileSize * MapSize;
    this.mapContext = <CanvasRenderingContext2D>this.mapCanvas.getContext("2d");
    this.mapContext.imageSmoothingEnabled = false;

    this.mouseCanvas = document.createElement("canvas");
    this.mouseCanvas.width = this.tileSize * 3;
    this.mouseCanvas.height = this.tileSize * 3;
    this.mouseContext = <CanvasRenderingContext2D>(
      this.mouseCanvas.getContext("2d")
    );
    this.mouseContext.imageSmoothingEnabled = false;

    this.keyBoardService.Start();

    if (map.length <= 0) {
      this.$store.commit("InitMap", MapSize);
    }
    this.map = map;

    imageService.isLoaded().then(() => {
      window.requestAnimationFrame(() => {
        this.draw(true);
        this.mapLoop();
      });
    });

    // Prevent scrolling on the page when you scroll on the canvas
    this.canvas.onwheel = function (event) {
      event.preventDefault();
    };

    EventBus.$on(
      "consumable-production",
      (event: { [id in Consumable]: number }) => {
        this.lastMouseTileCoord = this.mouseTileCoord!;
        this.$forceUpdate(); // I don't know why I fucking need this faoce update but hey
      }
    );
  }

  private beforeDestroy() {
    window.cancelAnimationFrame(this.animLoop);
  }

  public shouldShowParticles() {
    return (
      this.$store.state.consumablesProduced &&
      Object.keys(this.$store.state.consumablesProduced).length != 0
    );
  }

  public getConsumableIcon() {
    const possibleIcons = Object.keys(this.$store.state.consumablesProduced)
      .filter(
        (x) => this.$store.state.consumablesProduced[x as Consumable]! > 0
      )
      .map((consumable) => {
        return StaticConsumableInfo[consumable as Consumable].icon;
      });

    possibleIcons.push("./img/star.png");

    if (possibleIcons.length == 1) {
      return "./img/star.png";
    }

    let icon: Consumable = possibleIcons[
      Math.floor(Math.random() * possibleIcons.length)
    ] as Consumable;

    return icon;
  }

  public mapLoop() {
    this.animLoop = window.requestAnimationFrame(() => this.mapLoop());

    this.compute();
    this.draw(false);
  }

  public get debugMode() {
    return this.$store.state.debugMode;
  }

  private compute() {
    const keyBoardMapMoveSpeed = 3;
    if (this.keyBoardService.IsKeyPressed(Keycodes.UP_ARROW))
      this.mapOffset.y += keyBoardMapMoveSpeed;
    else if (this.keyBoardService.IsKeyPressed(Keycodes.DOWN_ARROW))
      this.mapOffset.y -= keyBoardMapMoveSpeed;

    if (this.keyBoardService.IsKeyPressed(Keycodes.RIGHT_ARROW))
      this.mapOffset.x -= keyBoardMapMoveSpeed;
    else if (this.keyBoardService.IsKeyPressed(Keycodes.LEFT_ARROW))
      this.mapOffset.x += keyBoardMapMoveSpeed;

    const wheelDelta = this.keyBoardService.GetWheelDelta();
    if (wheelDelta < 0 && this.mouseTileCoord && this.tileSize < 64) {
      // Recenter camera on center tile
      this.mapOffset.x = this.mapOffset.x * 2 - this.canvasSize / 2;
      this.mapOffset.y = this.mapOffset.y * 2 - this.canvasSize / 2;

      // Resize tiles and map
      this.nbTilesOnRowOrColumnOnScreen /= 2;
      this.tileSize *= 2;

      this.$store.commit("MapNeedsUpdate");
    } else if (wheelDelta > 0 && this.mouseTileCoord && this.tileSize > 8) {
      // Recenter camera on center tile
      this.mapOffset.x = this.mapOffset.x / 2 + this.canvasSize / 4;
      this.mapOffset.y = this.mapOffset.y / 2 + this.canvasSize / 4;

      // Resize tiles and map
      this.nbTilesOnRowOrColumnOnScreen *= 2;
      this.tileSize /= 2;

      this.boundMapOffset();

      this.$store.commit("MapNeedsUpdate");
    }
    this.keyBoardService.Reset();
  }

  public deleteBuilding(coord: { x: number; y: number }) {
    this.tryBuild(coord, null);
    this.tooltipTile = null;
  }

  private drawMap() {
    // Refresh canvas layers since their size can have changed
    this.mouseCanvas.width = this.tileSize * 3;
    this.mouseCanvas.height = this.tileSize * 3;
    this.mapCanvas.width = this.tileSize * MapSize;
    this.mapCanvas.height = this.tileSize * MapSize;
    this.mapContext.imageSmoothingEnabled = false;
    this.mouseContext.imageSmoothingEnabled = false;
    this.mapContext.font = Math.floor(this.tileSize / 2) + "px Arial";

    this.mapContext.clearRect(
      0,
      0,
      this.tileSize * MapSize,
      this.tileSize * MapSize
    );
    for (var i = 0; i < MapSize; i++) {
      for (var j = 0; j < MapSize; j++) {
        if (this.map[i][j].discovered) {
          let environmentImage = imageService.getEnvironmentImage(
            this.map[i][j].e,
            this.map[i][j].r
          );
          this.mapContext.drawImage(
            environmentImage,
            i * this.tileSize,
            j * this.tileSize,
            this.tileSize,
            this.tileSize
          );

          const building = this.map[i][j].b;
          const quantity = this.map[i][j].q;
          if (building != null) {
            let buildingImage = imageService.getBuildingImage(
              building,
              quantity
            );

            this.mapContext.drawImage(
              buildingImage,
              i * this.tileSize,
              j * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            this.mapContext.globalAlpha = 1;
          }

          // The following statement is cached
        } else if (map[i][j].discoverable > 0) {
          let environmentImage = imageService.getEnvironmentImage(
            this.map[i][j].e,
            this.map[i][j].r
          );
          this.mapContext.drawImage(
            environmentImage,
            i * this.tileSize,
            j * this.tileSize,
            this.tileSize,
            this.tileSize
          );

          const building = this.map[i][j].b;
          const quantity = this.map[i][j].q;
          if (building != null) {
            let buildingImage = imageService.getBuildingImage(
              building,
              quantity
            );
            this.mapContext.drawImage(
              buildingImage,
              i * this.tileSize,
              j * this.tileSize,
              this.tileSize,
              this.tileSize
            );
          }

          this.mapContext.globalAlpha = 0.7;
          this.mapContext.fillRect(
            i * this.tileSize,
            j * this.tileSize,
            this.tileSize,
            this.tileSize
          );
          this.mapContext.globalAlpha = 1;
        }
      }
    }
  }

  private drawMouse() {
    this.mouseContext.clearRect(0, 0, 3 * this.tileSize, 3 * this.tileSize);
    if (this.mouseTileCoord && this.building != null) {
      let image = imageService.getBuildingImage(this.building, 20);
      if (image) {
        this.mouseContext.globalAlpha = 0.7;
        const canBuild = this.canBeBuilt(
          this.mouseTileCoord,
          this.building
        ).result;
        if (!canBuild) {
          // Show a red bg when a building can't be built
          this.mouseContext.fillStyle = "#FF0000";
          this.mouseContext.fillRect(
            this.tileSize,
            this.tileSize,
            this.tileSize,
            this.tileSize
          );
          this.mouseContext.fillStyle = "#000";
        }
        this.mouseContext.drawImage(
          image,
          this.tileSize,
          this.tileSize,
          this.tileSize,
          this.tileSize
        );
        if (StaticBuildingInfo[this.building].highlightAdjacentTiles) {
          this.mouseContext.strokeStyle = canBuild ? "#00a6c6" : "#FF0000";
          this.mouseContext.lineWidth = 5;
          this.mouseContext.strokeRect(
            0,
            0,
            3 * this.tileSize,
            3 * this.tileSize
          );
          this.mouseContext.strokeStyle = "#000";
        }

        this.mouseContext.globalAlpha = 1.0;
      }
    }
  }

  private draw(forced: boolean) {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.tileSize * MapSize, this.tileSize * MapSize);

    if (forced || this.$store.state.map.mapNeedsUpdate) {
      this.drawMap();
      this.$store.commit("MapHaveBeenUpdated");
    }

    if (forced || true /*TODO*/) {
      this.drawMouse();
    }

    this.ctx.drawImage(this.mapCanvas, this.mapOffset.x, this.mapOffset.y);
    if (this.mouseTileCoord)
      this.ctx.drawImage(
        this.mouseCanvas,
        (this.mouseTileCoord.x - 1) * this.tileSize + this.mapOffset.x,
        (this.mouseTileCoord.y - 1) * this.tileSize + this.mapOffset.y
      );
  }

  public handleMouseDown(event: MouseEvent) {
    if (event.button != 0) {
      // if right or middle click
      this.$emit("clear-building", null);
      event.preventDefault();
      event.stopPropagation();

      this.tooltipTile = null;
      return false;
    }

    var canvasSize = this.tileSize * MapSize;
    if (
      event.pageX / this.zoom < canvasSize + this.canvas.offsetLeft &&
      event.pageX / this.zoom > this.canvas.offsetLeft &&
      event.pageY / this.zoom < canvasSize + this.canvas.offsetTop &&
      event.pageY / this.zoom > this.canvas.offsetTop
    ) {
      this.isMouseDown = true;
      this.isDragging = true;
      this.draggingStartPoint = {
        x: event.pageX / this.zoom - this.mapOffset.x,
        y: event.pageY / this.zoom - this.mapOffset.y,
      };
    }
  }

  public handleTouchStart(events: TouchEvent) {
    if (
      !events.touches ||
      events.touches.length == 0 ||
      events.touches.length > 1
    )
      return;

    let event = events.touches[0];

    this.mouseTileCoord = this.getTileFromCoordinate(
      event.pageX / this.zoom - this.canvas.offsetLeft,
      event.pageY / this.zoom - this.canvas.offsetTop
    );

    var canvasSize = this.tileSize * MapSize;
    if (
      event.pageX / this.zoom < canvasSize + this.canvas.offsetLeft &&
      event.pageX / this.zoom > this.canvas.offsetLeft &&
      event.pageY / this.zoom < canvasSize + this.canvas.offsetTop &&
      event.pageY / this.zoom > this.canvas.offsetTop
    ) {
      this.isMouseDown = true;
      this.isDragging = true;
      this.draggingStartPoint = {
        x: event.pageX / this.zoom - this.mapOffset.x,
        y: event.pageY / this.zoom - this.mapOffset.y,
      };
    }
  }

  public handleMouseUp(event: MouseEvent) {
    if (event.button != 0) {
      // if right or middle click
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    var coord = this.getTileFromCoordinate(
      event.pageX / this.zoom - this.canvas.offsetLeft,
      event.pageY / this.zoom - this.canvas.offsetTop
    );
    this.showDraggingHand = false;

    if (this.isDragging) {
      if (this.building == null) {
        if (!this.tooltipTile) {
          this.tooltipCoord = {
            x: event.pageX / this.zoom - this.canvas.offsetLeft,
            y: event.pageY / this.zoom - this.canvas.offsetTop,
          };
          this.tooltipTileCoord = { x: coord.x, y: coord.y };
          this.tooltipTile = this.map[coord.x][coord.y];
        } else {
          this.tooltipTile = null;
        }
      } else {
        //Check if this was a drag or a click
        this.tryBuild(coord, this.building);
      }
    }

    this.isDragging = true;
    this.isMouseDown = false;
  }

  public handleTouchEnd(events: TouchEvent) {
    if (
      !events.touches ||
      events.touches.length == 0 ||
      events.touches.length > 1
    )
      return;

    let event = events.touches[0];

    var coord = this.getTileFromCoordinate(
      event.pageX / this.zoom - this.canvas.offsetLeft,
      event.pageY / this.zoom - this.canvas.offsetTop
    );
    this.showDraggingHand = false;

    if (this.isDragging) {
      if (this.building == null) {
        if (!this.tooltipTile) {
          this.tooltipCoord = {
            x: event.pageX / this.zoom - this.canvas.offsetLeft,
            y: event.pageY / this.zoom - this.canvas.offsetTop,
          };
          this.tooltipTileCoord = { x: coord.x, y: coord.y };
          this.tooltipTile = this.map[coord.x][coord.y];
        } else {
          this.tooltipTile = null;
        }
      } else {
        //Check if this was a drag or a click
        this.tryBuild(coord, this.building);
      }
    }

    this.isDragging = true;
    this.isMouseDown = false;
    this.mouseTileCoord = null;
  }

  public handleMouseOut() {
    this.mouseTileCoord = null;
    this.isMouseDown = false;
    this.showDraggingHand = false;
  }

  // TODO: could be gathered in the mainLoop
  public handleMouseMove(event: MouseEvent) {
    this.mouseTileCoord = this.getTileFromCoordinate(
      event.pageX / this.zoom - this.canvas.offsetLeft,
      event.pageY / this.zoom - this.canvas.offsetTop
    );
    if (this.isMouseDown) {
      //var prevMapOffeset = Object.assign({}, this.mapOffset);
      this.mapOffset.x = event.pageX / this.zoom - this.draggingStartPoint.x;
      this.mapOffset.y = event.pageY / this.zoom - this.draggingStartPoint.y;

      this.boundMapOffset();

      // If a drag happened do not consider it as a click
      this.isDragging = false;
      this.showDraggingHand = true;
      this.showCursorHelp = false;
      this.$forceUpdate();
    }
  }

  public handleTouchMove(events: TouchEvent) {
    if (
      !events.touches ||
      events.touches.length == 0 ||
      events.touches.length > 1
    )
      return;

    let event = events.touches[0];

    this.mouseTileCoord = this.getTileFromCoordinate(
      event.pageX / this.zoom - this.canvas.offsetLeft,
      event.pageY / this.zoom - this.canvas.offsetTop
    );
    if (this.isMouseDown) {
      //var prevMapOffeset = Object.assign({}, this.mapOffset);
      this.mapOffset.x = event.pageX / this.zoom - this.draggingStartPoint.x;
      this.mapOffset.y = event.pageY / this.zoom - this.draggingStartPoint.y;

      this.boundMapOffset();

      // If a drag happened do not consider it as a click
      this.isDragging = false;
      this.showDraggingHand = true;
      this.showCursorHelp = false;
      this.$forceUpdate();
    }
  }

  private tryBuild(coord: { x: number; y: number }, building: Building | null) {
    const canBeBuilt = this.canBeBuilt(coord, building);
    if (!canBeBuilt.result) {
      Vue.toasted.error(
        `You cannot build this building here: ${canBeBuilt.reason}`
      );
      //this.$emit("clear-building", null);
      return;
    }

    // Pay the price of your purchase
    if (building != null) {
      for (let consumable in StaticBuildingInfo[building].price) {
        let price =
          StaticBuildingInfo[building].price[consumable as Consumable];
        if (price && price != 0) {
          this.$store.commit("IncrementConsumable", {
            name: consumable,
            value: -price,
          });
        }
      }
    }

    this.$store.commit("ChangeTile", {
      x: coord.x,
      y: coord.y,
      type: building,
    });
  }

  private canBeBuilt(
    coord: { x: number; y: number },
    building: Building | null
  ): { result: boolean; reason: string | null } {
    if (coord.x < 0 || coord.y < 0 || coord.x >= MapSize || coord.y >= MapSize)
      return { result: false, reason: "This tile is outside the map" };

    // Check if you can afford your purchase
    if (building != null) {
      for (let consumableId in StaticBuildingInfo[building].price) {
        let price =
          StaticBuildingInfo[building].price[consumableId as Consumable];

        if (
          price &&
          this.consumables[consumableId as Consumable].quantity < price
        )
          return {
            result: false,
            reason: `You don't have enough ${consumableId}`,
          };
      }
    }

    // If building is already there
    if (this.map[coord.x][coord.y].b != null)
      return {
        result: false,
        reason: `There is already a ${this.map[coord.x][coord.y].b} here`,
      };

    // If not discovered
    if (!this.map[coord.x][coord.y].discovered)
      return {
        result: false,
        reason: `This tile have not been discovered yet`,
      };

    // You can't build on water
    if (this.map[coord.x][coord.y].e == Environment.Water)
      return { result: false, reason: `You cannot build this on water` };

    // You must build sawmill next to a forest
    if (
      building == Building.sawmill &&
      this.map[coord.x][coord.y].closeByTrees <= 0
    )
      return {
        result: false,
        reason: `A ${building} must be built next to a forest`,
      };

    // You must build farms on a field
    if (
      building == Building.farm &&
      this.map[coord.x][coord.y].e != Environment.Field
    )
      return {
        result: false,
        reason: `A ${building} must be built on a field`,
      };

    return { result: true, reason: null };
  }

  private getTileFromCoordinate(x: number, y: number) {
    return {
      x: Math.floor((x - this.mapOffset.x) / this.tileSize),
      y: Math.floor((y - this.mapOffset.y) / this.tileSize),
    };
  }

  private boundMapOffset() {
    if (
      this.mapOffset.x <
      (-MapSize + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize
    )
      this.mapOffset.x =
        (-MapSize + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize;
    if (this.mapOffset.x > 0) this.mapOffset.x = 0;

    if (
      this.mapOffset.y <
      (-MapSize + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize
    )
      this.mapOffset.y =
        (-MapSize + this.nbTilesOnRowOrColumnOnScreen) * this.tileSize;
    if (this.mapOffset.y > 0) this.mapOffset.y = 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.map {
  margin: auto;
  //cursor: url("../../public/img/cursors/cursor-hand-can-grab.png"), auto;
}

.map.cursor-grabbing {
  cursor: url("../../public/img/cursors/cursor-hand-grabbing.png"), auto !important;
}

.map.cursor-pointing {
  cursor: url("../../public/img/cursors/cursor-hand.png"), auto;
}

.cursor-help {
  position: absolute;
  margin-top: 32px;
  margin-left: 32px;
  pointer-events: none;
  opacity: 0.8;
}

.particle-container {
  background-color: red;
  position: relative;
  pointer-events: none;
}

@d: 32px;

.particle {
  position: absolute;
  left: -100px;
  top: -100px;
  width: @d;
  height: @d;
  animation: shoot 3s ease-out;
  animation-name: shoot, fade;
  image-rendering: pixelated;
  opacity: 0;
}

@keyframes shoot {
  0% {
    transform: translate(100px, 100px);
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
