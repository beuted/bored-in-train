import { StaticJobInfo, IStaticJob, IStaticJobProduction, StaticConsummableInfo, IStaticConsummable, GlobalConfig } from './GameEngine';
import { Job } from '@/models/Job';
import { IJobProductionEvent, EventBus } from '@/EventBus';
import { Consummable } from '@/models/Consummable';
import store from '@/store'
import Vue from 'vue';

export class GameService {
  private readonly StarvationFactor = 0.5; // Portion of disapearing goods when missing consummable
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
    if (!store.state.controls.play) {
      // Recursive setTimeout for precision
      setTimeout (() => {
        this.mainLoop()
      }, GlobalConfig.TickInterval / store.state.controls.speed);
      return;
    }

    let newConsummables = JSON.parse(JSON.stringify(store.state.consummable)); // TODO: Dirty deepcopy because Object.assign isn't enought

    // First the creation of ressources
    for (let jobId in StaticJobInfo) {
      let staticJob: IStaticJob = StaticJobInfo[jobId as Job]; //TODO: fix typeing weirdlness

      for (let consummableId in staticJob.produce) {
        let staticJobProduction: IStaticJobProduction | null = staticJob.produce[consummableId as Consummable];
        if (staticJobProduction == null)
          continue;

        let nbProducers = store.state.map.jobs[jobId as Job].quantity;
        newConsummables[consummableId as Consummable].quantity += nbProducers * staticJobProduction.quantity;
      }

      let nbUnfullfiledWorkers = 0; // Nb workers that have not been receiving ressources therefore will be deduced from production
      for (let consummableId in staticJob.consume) {
        let staticJobConsumption: IStaticJobProduction | null = staticJob.consume[consummableId as Consummable];
        if (staticJobConsumption == null)
          continue;

        let nbConsummer = store.state.map.jobs[jobId as Job].quantity;
        if (newConsummables[consummableId as Consummable].quantity >= nbConsummer * staticJobConsumption.quantity) {
          newConsummables[consummableId as Consummable].quantity -= nbConsummer * staticJobConsumption.quantity;
        } else {
          // Do not produce if needs not fulfilled!
          const whatCanBeconsummed = store.state.consummable[consummableId as Consummable].quantity;
          let nbUnfullfiledWorkersOnConsummable = Math.floor((nbConsummer * staticJobConsumption.quantity - store.state.consummable[consummableId as Consummable].quantity) / staticJobConsumption.quantity);
          nbUnfullfiledWorkers = Math.max(nbUnfullfiledWorkers, nbUnfullfiledWorkersOnConsummable);

          newConsummables[consummableId as Consummable].quantity -= whatCanBeconsummed;
        }
      }


      // Remove part of production based on number of workers with non-fullfiled needs
      if (nbUnfullfiledWorkers > 0) {
        Vue.toasted.error(`${nbUnfullfiledWorkers} ${jobId} have not seen their needs fullfiled, they will not produce any ressource`);
        for (let consummableId in staticJob.produce) {
          let staticJobProduction: IStaticJobProduction | null = staticJob.produce[consummableId as Consummable];
          if (staticJobProduction == null)
            continue;

          newConsummables[consummableId as Consummable].quantity -= nbUnfullfiledWorkers * staticJobProduction.quantity;
        }
      }

    }

    // After operation checks (storage, ...)
    for (let consummableId in StaticConsummableInfo) {
      let staticConsummable: IStaticConsummable = StaticConsummableInfo[consummableId as Consummable]; //TODO: fix typeing weirdlness
      // See if storage fits
      if (staticConsummable.storage && staticConsummable.storage.capacity * store.state.map.buildings[staticConsummable.storage.name].quantity < newConsummables[consummableId as Consummable].quantity) {
        let quantityToRemove = this.LackOfStorageFactor *
          (newConsummables[consummableId as Consummable].quantity - store.state.map.buildings[staticConsummable.storage.name].quantity * staticConsummable.storage.capacity);
          newConsummables[consummableId as Consummable].quantity -= quantityToRemove;
      }
    }

    let production = GameService.getProductionDiff(newConsummables, store.state.consummable);
    store.commit('IncrementConsummables', production);
    EventBus.$emit('consummable-production', production);

    this.tryDiscoverLand();

    this.handlePollution();

    // Recursive setTimeout for precision
    setTimeout (() => {
      this.mainLoop()
    }, GlobalConfig.TickInterval / store.state.controls.speed);
  }

  private tryDiscoverLand() {
    let nbExplorers = store.state.map.jobs.explorer.quantity;

    if (nbExplorers > 0 && store.state.controls.play) {
      let nbLandFound = store.state.map.mapNbTileFound;
      // Probabilty in proba of at least 1 explorer out of nbExplorers to find a tile
      let probability = 1-Math.pow(1-2/nbLandFound, nbExplorers*2);
      if (Math.random() <= probability) {
        Vue.toasted.success(`Land Found! (Probability was: ${probability.toPrecision(2)})`);
        store.dispatch('DiscoverTile');
      }
    }
  }

  private handlePollution() {
    // Add and remove and spread pollution
    store.commit('ApplyPollution');
  }

  private static getProductionDiff(newConsummables: { [id in Consummable]: { quantity: number } }, oldConsummables: { [id in Consummable]: { quantity: number } }) {
    let production = <{ [id in Consummable]: number }>{}

    for (let consummableId in StaticConsummableInfo) {
      production[consummableId as Consummable] = newConsummables[consummableId as Consummable].quantity - oldConsummables[consummableId as Consummable].quantity;
    }

    return production;
  }
}