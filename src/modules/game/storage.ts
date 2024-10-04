export class GameStorage<Key extends string = string> {
  private _storage: Storage;

  constructor(storage = localStorage) {
    this._storage = storage;
  }

  putToStorage(type: Key, data: Record<string | number, unknown>) {
    this._storage.setItem(type, JSON.stringify(data));
  }

  getFromStorage<T>(type: Key): T | null {
    if (!type) {
      return null;
    }

    const data = this._storage.getItem(type);

    return data ? JSON.parse(data) : null;
  }

  clear() {
    this._storage.clear();
  }

  removeItem(type: Key) {
    this._storage.removeItem(type);
  }
}
