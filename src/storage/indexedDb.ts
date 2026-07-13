const DATABASE_NAME = "padel-score-pwa";
const DATABASE_VERSION = 1;

export const STORE_ACTIVE_MATCH = "activeMatch";
export const STORE_MATCH_HISTORY = "matchHistory";
export const STORE_PREFERENCES = "preferences";

let databasePromise: Promise<IDBDatabase> | null = null;

export function openPadelDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB tidak tersedia di browser ini."));
  }

  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_ACTIVE_MATCH)) {
        database.createObjectStore(STORE_ACTIVE_MATCH);
      }

      if (!database.objectStoreNames.contains(STORE_MATCH_HISTORY)) {
        const historyStore = database.createObjectStore(STORE_MATCH_HISTORY, { keyPath: "id" });
        historyStore.createIndex("finishedAt", "finishedAt");
        historyStore.createIndex("mode", "mode");
        historyStore.createIndex("winner", "winner");
      }

      if (!database.objectStoreNames.contains(STORE_PREFERENCES)) {
        database.createObjectStore(STORE_PREFERENCES);
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

  return databasePromise;
}

export async function readFromStore<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
  const database = await openPadelDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
  });
}

export async function writeToStore<T>(storeName: string, value: T, key?: IDBValidKey): Promise<void> {
  const database = await openPadelDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = key === undefined ? store.put(value) : store.put(value, key);

    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

export async function deleteFromStore(storeName: string, key: IDBValidKey): Promise<void> {
  const database = await openPadelDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const request = transaction.objectStore(storeName).delete(key);

    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

export async function readAllFromStore<T>(storeName: string): Promise<T[]> {
  const database = await openPadelDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as T[]);
  });
}
