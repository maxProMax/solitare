import { makeObservable, observable, action } from "mobx";
import { GameStorage } from "./storage";

enum Points {
  start = -52,
  addToFoundation = 10,
  removeFromFoundation = -15,
  base = 5,
}

export class Score {
  private _total: number = 0;

  get total() {
    return this._total;
  }
  set total(total: number) {
    this._total = total;
  }

  setTotal(score: number) {
    this._total += score;
  }

  constructor() {
    makeObservable<Score, "_total">(this, {
      _total: observable,
      startGame: action,
      addToFoundation: action,
      removeFromFoundation: action,
      openCard: action,
      moveFromWaste: action,
    });

    this.startGame();
  }

  startGame() {
    this.setTotal(Points.start);
  }

  addToFoundation() {
    this.setTotal(Points.addToFoundation);
  }

  removeFromFoundation() {
    this.setTotal(Points.removeFromFoundation);
  }

  openCard() {
    this.setTotal(Points.base);
  }

  moveFromWaste() {
    this.setTotal(Points.base);
  }
}

export class ScoreWithStorage extends Score {
  private _storage: GameStorage<"score">;

  constructor(storage?: Storage) {
    super();

    this._storage = new GameStorage(storage);
  }

  setTotal(score: number) {
    super.setTotal(score);
    this.saveState();
  }

  startGame() {}

  saveState() {
    this._storage.putToStorage("score", { total: super.total });
  }

  get savedState() {
    const { total } =
      this._storage.getFromStorage<{ total: number }>("score") || {};

    return total;
  }
}

export class InitScore extends ScoreWithStorage {
  constructor(storage?: Storage) {
    super(storage);

    this.overrideStartGame();

    this.saveState();
  }

  overrideStartGame() {
    if (this.savedState) {
      this.total = this.savedState;
    } else {
      this.setTotal(Points.start);
    }
  }
}

export class ResetScore extends ScoreWithStorage {
  constructor(storage?: Storage) {
    super(storage);

    this.overrideStartGame();

    this.saveState();
  }

  overrideStartGame() {
    if (this.savedState) {
      this.total = this.savedState;
    }

    this.setTotal(Points.start);
  }
}
