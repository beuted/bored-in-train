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
      this.discoveryLoop();
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

    // First the creation of ressources
    for (let jobId in StaticJobInfo) {
      let staticJob: IStaticJob = StaticJobInfo[jobId as Job]; //TODO: fix typeing weirdlness

      // Create ProductionEvent
      var event: IJobProductionEvent = {
        job: jobId as Job,
        produced: {
          population: 0,
          food: 0,
          wood: 0,
          stones: 0,
          coals: 0,
          energy: 0,
          knowledge: 0
        }
      }

      for (let consummableId in staticJob.produce) {
        let staticJobProduction: IStaticJobProduction | null = staticJob.produce[consummableId as Consummable];
        if (staticJobProduction == null)
          continue;

        var nbProducers = store.state.jobs[jobId as Job].quantity;
        event.produced[consummableId as Consummable] += nbProducers * staticJobProduction.quantity;
      }

      let nbUnfullfiledWorkers = 0; // Nb workers that have not been receiving ressources therefore will be deduced from production
      for (let consummableId in staticJob.consume) {
        let staticJobConsumption: IStaticJobProduction | null = staticJob.consume[consummableId as Consummable];
        if (staticJobConsumption == null)
          continue;

        var nbConsummer = store.state.jobs[jobId as Job].quantity;
        if (store.state.consummable[consummableId as Consummable].quantity >= nbConsummer * staticJobConsumption.quantity) {
          event.produced[consummableId as Consummable] -= nbConsummer * staticJobConsumption.quantity;
        } else {
          // Do not produce if needs not fulfilled!
          const whatCanBeconsummed = store.state.consummable[consummableId as Consummable].quantity;
          let nbUnfullfiledWorkersOnConsummable = Math.floor((nbConsummer - store.state.consummable[consummableId as Consummable].quantity) / staticJobConsumption.quantity);
          nbUnfullfiledWorkers = Math.max(nbUnfullfiledWorkers, nbUnfullfiledWorkersOnConsummable);

          event.produced[consummableId as Consummable] -= whatCanBeconsummed;
        }
      }


      // Remove part of production based on number of workers with non-fullfiled needs
      if (nbUnfullfiledWorkers > 0) {
        Vue.toasted.error(`${nbUnfullfiledWorkers} ${jobId} have not seen their needs fullfiled, they will not produce any ressource`);
        for (let consummableId in staticJob.produce) {
          let staticJobProduction: IStaticJobProduction | null = staticJob.produce[consummableId as Consummable];
          if (staticJobProduction == null)
            continue;

          event.produced[consummableId as Consummable] -= nbUnfullfiledWorkers * staticJobProduction.quantity;
        }
      }

      store.commit('IncrementConsummables', event);
      EventBus.$emit('job-production', event);
    }

    // After operation checks (storage, ...)
    for (let consummableId in StaticConsummableInfo) {
      let staticConsummable: IStaticConsummable = StaticConsummableInfo[consummableId as Consummable]; //TODO: fix typeing weirdlness
      // See if storage fits
      if (staticConsummable.storage && staticConsummable.storage.capacity * store.state.map.buildings[staticConsummable.storage.name].quantity < store.state.consummable[consummableId as Consummable].quantity) {
        let quantityToRemove = Math.floor(this.LackOfStorageFactor *
          (store.state.consummable[consummableId as Consummable].quantity - store.state.map.buildings[staticConsummable.storage.name].quantity * staticConsummable.storage.capacity));
        store.commit('IncrementConsummable', { name: consummableId, value: -quantityToRemove });
        // Vue.toasted.error(`${quantityToRemove} ${consummableId} were thrown away due to lack of storage`);
      }
    }

    // Recursive setTimeout for precision
    setTimeout (() => {
      this.mainLoop()
    }, GlobalConfig.TickInterval / store.state.controls.speed);
  }

  private discoveryLoop() {
    var nbExplorers = store.state.jobs.explorer.quantity;

    if (nbExplorers > 0 && store.state.controls.play) {
      var nbLandFound = store.state.map.mapNbTileFound;
      // Probabilty in proba of at least 1 explorer out of nbExplorers to find a tile
      var probability = 1-Math.pow(1-2/nbLandFound, nbExplorers);
      if (Math.random() <= probability) {
        Vue.toasted.success(`Land Found! (Probability was: ${probability.toPrecision(2)})`);
        store.commit('DiscoverTile');
      }
    }

    // Recursive setTimeout for precision
    setTimeout (() => {
      this.discoveryLoop()
    }, 10 * GlobalConfig.TickInterval / store.state.controls.speed);
  }
}