import { IState, SaveStatus } from "@/store";
import store from "@/store";

export class StoreSaver {
  private static storageKey = "content";
  private static saveIntervalMs = 60000;

  public static SaveLoop() {
    // Recursive setTimeout for precision
    setTimeout(() => {
      StoreSaver.Save();
      StoreSaver.SaveLoop();
    }, StoreSaver.saveIntervalMs);
    return;
  }

  public static Restore() {
    store.commit("StoreSaverRestore", StoreSaver.LoadFromLocalDb());
  }

  public static Save() {
    console.log("Saving...");
    store.commit("StoreSaverSetSaveStatus", SaveStatus.Saving);
    StoreSaver.SaveFromLocalDb(store.state, function() {
      store.commit("StoreSaverSetSaveStatus", SaveStatus.Saved);
      console.log("Saved.");
    });
    return;
  }

  public static Reset() {
    console.log("Resetting...");
    window.localStorage.setItem(StoreSaver.storageKey, JSON.stringify({}));
    store.commit("StoreSaverRestore", {});
    location.reload();
    console.log("Reset.");
  }

  private static LoadFromLocalDb() {
    var json =
      window.localStorage.getItem(StoreSaver.storageKey) || JSON.stringify("");
    return JSON.parse(json);
  }

  private static SaveFromLocalDb(content: IState, callback: Function) {
    window.localStorage.setItem(StoreSaver.storageKey, JSON.stringify(content));
    callback();
  }
}

StoreSaver.Restore();
StoreSaver.SaveLoop();
