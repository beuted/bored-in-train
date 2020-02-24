import { IStaticBuildingProduction, StaticConsumableInfo, IStaticConsumable, GlobalConfig, StaticBuildingInfo, IStaticBuilding } from './GameEngine';
import { IProductionEvent, EventBus } from '@/EventBus';
import { Consumable } from '@/models/Consumable';
import store from '@/store'
import Vue from 'vue';
import { MessageService } from './MessageService';
import { Building } from '@/models/Building';

export class GameService {
  private readonly LackOfStorageFactor = 1.0; // Portion of disapearing goods when missing storage

  private hasBeenInit = false;

  public constructor() {
    if (this.hasBeenInit)
      return;

    // NASTY HACK: This timeout is here to let all services init before starting the game.
    setTimeout (() => {
      this.mainLoop();
      this.hasBeenInit = true;
    }, 1000);

    console.log(`I'm bored in a train`);
  }

  private mainLoop() {
    // in the case of pause nothing happens
    if (store.state.controls.speed <= 0) {
      // Recursive setTimeout for precision
      setTimeout (() => {
        this.mainLoop()
      }, GlobalConfig.TickInterval / store.state.controls.speed);
      return;
    }

    let newConsumables = JSON.parse(JSON.stringify(store.state.consumable)); // TODO: Dirty deepcopy because Object.assign isn't enough

    // First the creation of ressources
    for (let buildingId in StaticBuildingInfo) {
      let staticBuilding: IStaticBuilding = StaticBuildingInfo[buildingId as Building]; //TODO: fix typeing weirdlness

      for (let consumableId in staticBuilding.produce) {
        let staticBuildingProduction: IStaticBuildingProduction | null = staticBuilding.produce[consumableId as Consumable];
        if (staticBuildingProduction == null)
          continue;

        let nbProducers = store.state.map.buildings[buildingId as Building].quantity;
        newConsumables[consumableId as Consumable].quantity += nbProducers * staticBuildingProduction.quantity;
      }

      let nbUnfullfiledWorkers = 0; // Nb workers that have not been receiving ressources therefore will be deduced from production
      for (let consumableId in staticBuilding.consume) {
        let staticJobConsumption: IStaticBuildingProduction | null = staticBuilding.consume[consumableId as Consumable];
        if (staticJobConsumption == null)
          continue;

        let nbConsummer = store.state.map.buildings[buildingId as Building].quantity;
        if (newConsumables[consumableId as Consumable].quantity >= nbConsummer * staticJobConsumption.quantity) {
          newConsumables[consumableId as Consumable].quantity -= nbConsummer * staticJobConsumption.quantity;
        } else {
          // Do not produce if needs not fulfilled!
          const whatCanBeconsummed = store.state.consumable[consumableId as Consumable].quantity;
          let nbUnfullfiledWorkersOnConsumable = Math.floor((nbConsummer * staticJobConsumption.quantity - store.state.consumable[consumableId as Consumable].quantity) / staticJobConsumption.quantity);
          nbUnfullfiledWorkers = Math.max(nbUnfullfiledWorkers, nbUnfullfiledWorkersOnConsumable);

          newConsumables[consumableId as Consumable].quantity -= whatCanBeconsummed;
        }
      }


      // Remove part of production based on number of workers with non-fullfiled needs
      if (nbUnfullfiledWorkers > 0) {
        MessageService.Help(`Careful! Some ${buildingId} have not seen their needs fullfiled, they will not produce any ressource. Either produce more of the missing resource or remove some of them.`, 'needs-not-fullfiled');
        Vue.toasted.error(`${nbUnfullfiledWorkers} ${buildingId} have not seen their needs fullfiled, they will not produce any ressource`);
        for (let consumableId in staticBuilding.produce) {
          let staticJobProduction: IStaticBuildingProduction | null = staticBuilding.produce[consumableId as Consumable];
          if (staticJobProduction == null)
            continue;

          newConsumables[consumableId as Consumable].quantity -= nbUnfullfiledWorkers * staticJobProduction.quantity;
        }
      }

    }

    // After operation checks (storage, ...)
    for (let consumableId in StaticConsumableInfo) {
      let staticConsumable: IStaticConsumable = StaticConsumableInfo[consumableId as Consumable]; //TODO: fix typeing weirdlness
      // See if storage fits
      if (staticConsumable.storage && staticConsumable.storage.capacity * store.state.map.buildings[staticConsumable.storage.name].quantity < newConsumables[consumableId as Consumable].quantity) {
        let quantityToRemove = this.LackOfStorageFactor *
          (newConsumables[consumableId as Consumable].quantity - store.state.map.buildings[staticConsumable.storage.name].quantity * staticConsumable.storage.capacity);
          newConsumables[consumableId as Consumable].quantity -= quantityToRemove;

        // Show help messages
        if (consumableId as Consumable == Consumable.population) {
          MessageService.Help(`You have reached your max population, build more villages to welcome more people.`, 'max-pop-reached');
        } else {
          MessageService.Help(`You cannot store the ${consumableId} you produced, build more barns to store it.`, 'max-consumable-reached');
        }
      }
    }

    let production = GameService.getProductionDiff(newConsumables, store.state.consumable);
    store.commit('IncrementConsumables', production);
    EventBus.$emit('consumable-production', production);

    this.tryDiscoverLand();

    this.handlePollution();

    // Recursive setTimeout for precision
    setTimeout (() => {
      this.mainLoop()
    }, GlobalConfig.TickInterval / store.state.controls.speed);
  }

  private tryDiscoverLand() {
    //TODO: tours de gaie !
    let nbExplorers = 10;//store.state.map.buildings.explorer.quantity;

    if (nbExplorers > 0 && store.state.controls.speed > 0) {
      let nbLandFound = store.state.map.mapNbTileFound;
      // Probabilty in proba of at least 1 explorer out of nbExplorers to find a tile
      let probability = 1-Math.pow(1-2/nbLandFound, nbExplorers*2);
      if (Math.random() <= probability) {
        Vue.toasted.success(`Land Found! (Probability was: ${(probability*100).toPrecision(2)} %)`);
        store.dispatch('DiscoverTile');
      }
    }
  }

  private handlePollution() {
    // Add and remove and spread pollution
    store.commit('ApplyPollution');
  }

  private static getProductionDiff(newConsumables: { [id in Consumable]: { quantity: number } }, oldConsumables: { [id in Consumable]: { quantity: number } }) {
    let production = <{ [id in Consumable]: number }>{}

    for (let consumableId in StaticConsumableInfo) {
      production[consumableId as Consumable] = newConsumables[consumableId as Consumable].quantity - oldConsumables[consumableId as Consumable].quantity;
    }

    return production;
  }
}