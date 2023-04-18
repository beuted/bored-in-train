import { IState, SaveStatus } from "@/store";
import store from "@/store";
import { IMapTile } from "@/models/IMapTile";
import { map } from "./mapStoreModule";

export class StoreSaver {
  private static storageKey = "content";
  private static mapStorageKey = "map";
  private static saveIntervalMs = 5000;

  public static SaveLoop() {
    // Recursive setTimeout for precision
    setTimeout(() => {
      StoreSaver.Save();
      StoreSaver.SaveLoop();
    }, StoreSaver.saveIntervalMs);
    return;
  }

  public static Restore() {
    store.commit("StoreSaverRestore", {
      restoredState: StoreSaver.LoadFromLocalDb(),
      mapNew: StoreSaver.LoadMapFromLocalDb(),
    });
  }

  public static Save() {
    console.log("Saving...");
    store.commit("StoreSaverSetSaveStatus", SaveStatus.Saving);
    StoreSaver.SaveFromLocalDb(store.state, map, function () {
      store.commit("StoreSaverSetSaveStatus", SaveStatus.Saved);
      console.log("Saved.");
    });
    return;
  }

  public static Reset() {
    console.log("Resetting...");
    window.localStorage.setItem(StoreSaver.storageKey, JSON.stringify({}));
    window.localStorage.setItem(StoreSaver.mapStorageKey, JSON.stringify([]));
    store.commit("StoreSaverRestore", {
      restoredState: {},
      mapNew: [],
    });
    store.commit("WonTheGame", { value: false });
    location.reload();
    console.log("Reset.");
  }

  private static LoadFromLocalDb() {
    var json =
      window.localStorage.getItem(StoreSaver.storageKey) || JSON.stringify("");
    return JSON.parse(json);
  }

  private static LoadMapFromLocalDb() {
    var json =
      window.localStorage.getItem(StoreSaver.mapStorageKey) ||
      JSON.stringify("");
    return JSON.parse(json);
  }

  private static SaveFromLocalDb(
    content: IState,
    map: IMapTile[][],
    callback: Function
  ) {
    window.localStorage.setItem(StoreSaver.storageKey, JSON.stringify(content));
    window.localStorage.setItem(StoreSaver.mapStorageKey, JSON.stringify(map));
    callback();
  }
}

StoreSaver.Restore();
StoreSaver.SaveLoop();
