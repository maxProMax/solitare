import { makeObservable, action, observable } from "mobx";
import { Card, CardProperties } from "./card";
import { Transfer } from "./transfer";
import { Score } from "./score";
import { GameStorage } from "./storage";

interface StockProperties {
  transfer: Transfer;
  score: Score;
  cards: Card[];
}

export class Stock {
  private _score: Score;
  private _transfer: Transfer;
  private _waste: Card[] = [];
  private _cards: Card[] = [];

  constructor(properties: StockProperties) {
    const { transfer, score, cards } = properties;

    this._score = score;
    this._transfer = transfer;

    this.addToCards(...cards);

    makeObservable<Stock, "_waste">(this, {
      _waste: observable,
      addToWaste: action,
    });
  }

  get cards() {
    return this._cards;
  }

  get waste() {
    return this._waste;
  }

  set waste(cards: Card[]) {
    this._waste = cards;
  }

  addToCards(...cards: Card[]) {
    this._cards.push(...cards);
  }

  addToWaste() {
    const lastCard = this._cards.pop();

    if (lastCard) {
      lastCard.openCard();
      this._waste.push(lastCard);
    }
  }

  /** add cards to transfer */
  addToTransfer() {
    this._transfer.addCards(this, this._waste.slice(-1));
  }

  removeTransferredCards() {
    this._waste.pop();
    this._score.moveFromWaste();
  }
}

interface StockWithStorageProperties extends StockProperties {
  storage: GameStorage<"stock">;
}

export class StockWithStorage extends Stock {
  private _storage: GameStorage<"stock">;

  static clearState(storage: GameStorage<"stock">) {
    storage.removeItem("stock");
  }

  constructor(properties: StockWithStorageProperties) {
    const { cards, storage, ...rest } = properties;

    super({ ...rest, cards: [] });

    this._storage = storage;

    this.populatedCards(cards);

    this.saveState();
  }

  populatedCards(cards: Card[]): void {
    if (this.savedState) {
      this.addToCards(...Card.fromArray(this.savedState.cards));
      this.waste = Card.fromArray(this.savedState.waste);
    } else {
      this.addToCards(...cards);
    }
  }

  addToWaste() {
    super.addToWaste();

    this.saveState();
  }

  removeTransferredCards() {
    super.removeTransferredCards();

    this.saveState();
  }

  saveState() {
    this._storage.putToStorage("stock", {
      cards: this.cards,
      waste: this.waste,
    });
  }

  get savedState() {
    return this._storage.getFromStorage<{
      cards: CardProperties[];
      waste: CardProperties[];
    }>("stock");
  }
}
