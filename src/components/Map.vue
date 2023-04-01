<template>
  <div>
    <TileTooltip
      :tile="tooltipTile"
      :coord="tooltipCoord"
      :tileCoord="tooltipTileCoord"
      v-on:delete-building="deleteBuilding"
    ></TileTooltip>
    <canvas
      id="canvas"
      class="map"
      v-on:mousedown="handleMouseDown"
      v-on:mouseup="handleMouseUp"
      v-on:mousemove="handleMouseMove"
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
import { Building, isAMine } from "@/models/Building";
import { Habitat } from "@/models/Habitat";
import { StaticBuildingInfo, ResearchInfo } from "@/services/GameEngine";
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

@Component({
  components: {
    TileTooltip,
  },
})
export default class Map extends IdleGameVue {
  private nbTilesOnRowOrColumnOnScreen = 20;
  private tileSize = 32;

  private readonly nbTilesOnRowOrColumn = 100;
  public readonly canvasSize =
    this.nbTilesOnRowOrColumnOnScreen * this.tileSize;

  @Prop() private map!: IMapTile[][];
  @Prop() private buildings!: { [id in Building]: { quantity: number } };
  @Prop() private building!: Building | null; // The selected building
  @Prop() private consumables!: { [id in Consumable]: { quantity: number } };

  private keyBoardService: KeyboardService;

  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private mapCanvas!: HTMLCanvasElement;
  private mapContext!: CanvasRenderingContext2D;
  private mouseCanvas!: HTMLCanvasElement;
  private mouseContext!: CanvasRenderingContext2D;

  private mouseTileCoord: { x: number; y: number } | null = null;
  // TODO: this should not be init with a neg value... I have screwed up somewhere
  private mapOffset: { x: number; y: number } = {
    x:
      -Math.floor(
        this.nbTilesOnRowOrColumn / 2 - this.nbTilesOnRowOrColumnOnScreen / 2
      ) * this.tileSize,
    y:
      -Math.floor(
        this.nbTilesOnRowOrColumn / 2 - this.nbTilesOnRowOrColumnOnScreen / 2
      ) * this.tileSize,
  };
  private isMouseDown = false;
  private draggingStartPoint!: { x: number; y: number };
  private isDragging = true;
  public showPollution = false;
  private animLoop: number = -1;
  public tooltipCoord = { x: 0, y: 0 };
  public tooltipTileCoord = { x: 0, y: 0 };
  public tooltipTile: IMapTile | null = null;

  constructor() {
    super();

    this.keyBoardService = new KeyboardService();
  }

  private mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.mapCanvas = document.createElement("canvas");
    this.mapCanvas.width = this.tileSize * this.nbTilesOnRowOrColumn;
    this.mapCanvas.height = this.tileSize * this.nbTilesOnRowOrColumn;
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

    if (this.map.length <= 0)
      this.$store.commit("InitMap", this.nbTilesOnRowOrColumn);

    imageService.isLoaded().then(() => {
      window.requestAnimationFrame(() => {
        this.draw(true);
        this.mapLoop();
      });
    });
  }

  private beforeDestroy() {
    window.cancelAnimationFrame(this.animLoop);
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
    this.mapCanvas.width = this.tileSize * this.nbTilesOnRowOrColumn;
    this.mapCanvas.height = this.tileSize * this.nbTilesOnRowOrColumn;
    this.mapContext.imageSmoothingEnabled = false;
    this.mouseContext.imageSmoothingEnabled = false;
    this.mapContext.font = Math.floor(this.tileSize / 2) + "px Arial";

    this.mapContext.clearRect(
      0,
      0,
      this.tileSize * this.nbTilesOnRowOrColumn,
      this.tileSize * this.nbTilesOnRowOrColumn
    );
    for (var i = 0; i < this.nbTilesOnRowOrColumn; i++) {
      for (var j = 0; j < this.nbTilesOnRowOrColumn; j++) {
        if (this.map[i][j].discovered) {
          let environmentImage = imageService.getEnvironmentImage(
            this.map[i][j].environment
          );
          this.mapContext.drawImage(
            environmentImage,
            i * this.tileSize,
            j * this.tileSize,
            this.tileSize,
            this.tileSize
          );

          const building = this.map[i][j].building;
          const habitat = this.map[i][j].habitat;
          const quantity = this.map[i][j].quantity;
          if (building != null) {
            let buildingImage = imageService.getBuildingImage(
              building,
              quantity
            );

            if (this.map[i][j].disabled) this.mapContext.globalAlpha = 0.7;
            this.mapContext.drawImage(
              buildingImage,
              i * this.tileSize,
              j * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            this.mapContext.globalAlpha = 1;

            // Show population / forst amount on the map
            /*if (quantity > 0)
              this.mapContext.fillText(
                quantity + "",
                i * this.tileSize,
                (j + 0.5) * this.tileSize
              );*/

            const pop = this.map[i][j].population;
            if (pop > 0)
              this.mapContext.fillText(
                pop + "",
                i * this.tileSize,
                (j + 1) * this.tileSize
              );
          } else if (habitat != null) {
            // If a building is found no need to draw the habitat
            let habitatImage = imageService.getHabitatImage(habitat);
            this.mapContext.drawImage(
              habitatImage,
              i * this.tileSize,
              j * this.tileSize,
              this.tileSize,
              this.tileSize
            );
          }

          // Pollution
          if (this.showPollution && this.map[i][j].pollution > 0) {
            this.mapContext.fillStyle = "#FF0000";

            this.mapContext.globalAlpha = Math.min(
              this.map[i][j].pollution / 100,
              1
            );
            this.mapContext.fillRect(
              i * this.tileSize,
              j * this.tileSize,
              this.tileSize,
              this.tileSize
            );
            this.mapContext.globalAlpha = 1;
            this.mapContext.fillStyle = "#000000";
          }

          // The following statement is cached
        } else if (this.$store.state.map.map[i][j].discoverable > 0) {
          let environmentImage = imageService.getEnvironmentImage(
            this.map[i][j].environment
          );
          this.mapContext.drawImage(
            environmentImage,
            i * this.tileSize,
            j * this.tileSize,
            this.tileSize,
            this.tileSize
          );

          const building = this.map[i][j].building;
          const habitat = this.map[i][j].habitat;
          const quantity = this.map[i][j].quantity;
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
          } else if (habitat != null) {
            // If a building is found no need to draw the habitat
            let habitatImage = imageService.getHabitatImage(habitat);
            this.mapContext.drawImage(
              habitatImage,
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
        const canBuild = this.canBeBuilt(this.mouseTileCoord, this.building)
          .result;
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
        if (this.building == Building.sawmill) {
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
    this.ctx.fillRect(
      0,
      0,
      this.tileSize * this.nbTilesOnRowOrColumn,
      this.tileSize * this.nbTilesOnRowOrColumn
    );

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

    var canvasSize = this.tileSize * this.nbTilesOnRowOrColumn;
    if (
      event.pageX < canvasSize + this.canvas.offsetLeft &&
      event.pageX > this.canvas.offsetLeft &&
      event.pageY < canvasSize + this.canvas.offsetTop &&
      event.pageY > this.canvas.offsetTop
    ) {
      this.isMouseDown = true;
      this.isDragging = true;
      this.draggingStartPoint = {
        x: event.pageX - this.mapOffset.x,
        y: event.pageY - this.mapOffset.y,
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
      event.pageX - this.canvas.offsetLeft,
      event.pageY - this.canvas.offsetTop
    );

    if (this.isDragging) {
      if (this.building == null) {
        if (!this.tooltipTile) {
          this.tooltipCoord = {
            x: event.pageX - this.canvas.offsetLeft,
            y: event.pageY - this.canvas.offsetTop,
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

  public handleMouseOut() {
    this.mouseTileCoord = null;
    this.isMouseDown = false;
  }

  // TODO: could be gathered in the mainLoop
  public handleMouseMove(event: MouseEvent) {
    this.mouseTileCoord = this.getTileFromCoordinate(
      event.pageX - this.canvas.offsetLeft,
      event.pageY - this.canvas.offsetTop
    );
    if (this.isMouseDown) {
      //var prevMapOffeset = Object.assign({}, this.mapOffset);
      this.mapOffset.x = event.pageX - this.draggingStartPoint.x;
      this.mapOffset.y = event.pageY - this.draggingStartPoint.y;

      this.boundMapOffset();

      // Of a drag happened do not consider it as a click
      this.isDragging = false;
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
          if (consumable == Consumable.population) {
            this.$store.commit("IncrementPopStorage", { value: -price });
          }
        }
      }
    }

    //TODO: not ideal
    if (building == Building.village) {
      this.$store.commit("IncrementPopStorage", { value: 10 });
    }

    // Earn from the recycle of what you destroyed
    let recycledBuilding = this.map[coord.x][coord.y].building;

    if (recycledBuilding != null) {
      for (let consumable in StaticBuildingInfo[recycledBuilding].price) {
        let price =
          StaticBuildingInfo[recycledBuilding].price[consumable as Consumable];
        if (price && price != 0) {
          this.$store.commit("IncrementConsumable", {
            name: consumable,
            value: price,
          });
          if (consumable == Consumable.population) {
            this.$store.commit("IncrementPopStorage", { value: price });
          }
        }
      }

      //TODO: not ideal
      if (recycledBuilding == Building.village) {
        this.$store.commit("IncrementPopStorage", { value: -10 });
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
    if (
      coord.x < 0 ||
      coord.y < 0 ||
      coord.x >= this.nbTilesOnRowOrColumn ||
      coord.y >= this.nbTilesOnRowOrColumn
    )
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
    if (building != null && building == this.map[coord.x][coord.y].building)
      return { result: false, reason: `There is already a ${building} here` };

    // If not discovered
    if (!this.map[coord.x][coord.y].discovered)
      return {
        result: false,
        reason: `This tile have not been discovered yet`,
      };

    // You can't build on water
    if (this.map[coord.x][coord.y].environment == Environment.Water)
      return { result: false, reason: `You cannot build this on water` };

    // You must build coalMine on coalDeposite
    if (
      building == Building.coalMine &&
      this.map[coord.x][coord.y].habitat !== Habitat.CoalDeposite
    )
      return {
        result: false,
        reason: `A ${building} must be built on a coal deposite`,
      };

    // You must build stoneMine on stoneDeposite
    if (
      building == Building.stoneMine &&
      this.map[coord.x][coord.y].habitat !== Habitat.StoneDeposite
    )
      return {
        result: false,
        reason: `A ${building} must be built on a stone deposite`,
      };

    // You must build limestoneMine on limestoneDeposite
    if (
      building == Building.limestoneMine &&
      this.map[coord.x][coord.y].habitat !== Habitat.LimestoneDeposite
    )
      return {
        result: false,
        reason: `A ${building} must be built on a limestone deposite`,
      };

    // You must build sawmill next to a forest
    if (
      building == Building.sawmill &&
      this.map[coord.x][coord.y].closeByTrees <= 0
    )
      return {
        result: false,
        reason: `A ${building} must be built next to a forest`,
      };

    // You cannot build buildings that are not mines on deposits
    if (!isAMine(building) && this.map[coord.x][coord.y].habitat != null)
      return {
        result: false,
        reason: `A ${building} cannot be built on a deposit`,
      };

    // You must build farms on a field
    if (
      building == Building.farm &&
      this.map[coord.x][coord.y].environment != Environment.Field
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
      (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) *
        this.tileSize
    )
      this.mapOffset.x =
        (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) *
        this.tileSize;
    if (this.mapOffset.x > 0) this.mapOffset.x = 0;

    if (
      this.mapOffset.y <
      (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) *
        this.tileSize
    )
      this.mapOffset.y =
        (-this.nbTilesOnRowOrColumn + this.nbTilesOnRowOrColumnOnScreen) *
        this.tileSize;
    if (this.mapOffset.y > 0) this.mapOffset.y = 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.map {
  margin: auto;
  cursor: pointer;
}
</style>
