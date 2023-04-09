import { Environment } from "@/models/Environment";
import { Building } from "@/models/Building";
import {
  StaticBuildingInfo,
  ResearchInfo,
  StaticEnvironmentInfo,
} from "./GameEngine";
import { Research } from "@/models/Research";

class ImageService {
  private loaded: boolean = false;
  private mapEnvironmentImages: { [id: number]: HTMLImageElement } = {
    [Environment.Water]: new Image(),
    [Environment.Field]: new Image(),
    [Environment.Beach]: new Image(),
    [Environment.Snow]: new Image(),
    [Environment.Concrete]: new Image(),
  };

  private mapForestImages: { [id in number]: HTMLImageElement } = {
    1: new Image(),
    2: new Image(),
    3: new Image(),
  };

  private static GetInitialMapBuildingImages(): {
    [id in Building]: HTMLImageElement
  } {
    let initialBuildingImages = Object.keys(StaticBuildingInfo).reduce<
      Partial<{ [id in Building]: HTMLImageElement }>
    >((accumulator, building) => {
      accumulator[building as Building] = new Image();
      return accumulator;
    }, {}) as { [id in Building]: HTMLImageElement };

    return initialBuildingImages;
  }

  private mapBuildingImages: {
    [id in Building]: HTMLImageElement
  } = ImageService.GetInitialMapBuildingImages();

  private static GetInitialResearchImages(): {
    [id in Research]: HTMLImageElement
  } {
    let initialResearchImages = Object.keys(ResearchInfo).reduce<
      Partial<{ [id in Research]: HTMLImageElement }>
    >((accumulator, research) => {
      accumulator[research as Research] = new Image();
      return accumulator;
    }, {}) as { [id in Research]: HTMLImageElement };

    return initialResearchImages;
  }

  private researchImages: {
    [id in Research]: HTMLImageElement
  } = ImageService.GetInitialResearchImages();

  public constructor() {
    for (const environment in StaticEnvironmentInfo)
      this.mapEnvironmentImages[environment].src =
        StaticEnvironmentInfo[environment].icon;

    for (const building in StaticBuildingInfo)
      this.mapBuildingImages[building as Building].src =
        StaticBuildingInfo[building as Building].icon;

    this.mapForestImages[1].src = "./img/arbres-stage1.png";
    this.mapForestImages[2].src = "./img/arbres-stage2.png";
    this.mapForestImages[3].src = "./img/arbres-stage3.png";

    for (const research in ResearchInfo)
      this.researchImages[research as Research].src =
        ResearchInfo[research as Research].icon;
  }

  public getEnvironmentImage(environment: Environment): HTMLImageElement {
    return this.mapEnvironmentImages[environment];
  }

  public getBuildingImage(
    building: Building,
    quantity: number
  ): HTMLImageElement {
    if (building == Building.forest) {
      if (quantity <= 33) return this.mapForestImages[1];
      else if (quantity <= 66) return this.mapForestImages[2];
      else return this.mapForestImages[3];
    }
    return this.mapBuildingImages[building];
  }

  public getResearchImages(research: Research) {
    return this.researchImages[research];
  }

  public isLoaded() {
    return new Promise<void>((resolve, reject) => {
      if (this.loaded) resolve();
      let nbEnvImages = Object.keys(this.mapEnvironmentImages).length;
      let nbBuildingImages = Object.keys(this.mapBuildingImages).length;

      for (const key in this.mapBuildingImages) {
        (this.mapBuildingImages as any)[key].onload = () => {
          nbBuildingImages--;
          if (nbBuildingImages == 0 && nbEnvImages == 0) {
            this.loaded = true;
            resolve();
          }
        };
      }

      for (const key in this.mapEnvironmentImages) {
        (this.mapEnvironmentImages as any)[key].onload = () => {
          nbEnvImages--;
          if (nbEnvImages == 0 && nbBuildingImages == 0) {
            this.loaded = true;
            resolve();
          }
        };
      }
    });
  }
}

export const imageService = new ImageService();
