import { makeObservable, action, observable } from "mobx";
import { Card, CardProperties } from "./card";
import { GameStorage } from "./storage";
import { GameState } from "./game";
import { IHistoryConsumer } from "./history";
import { ITransferConsumer } from "./transfer";

export class Stock {
  protected _waste: Card[] = [];
  protected _cards: Card[] = [];

  constructor(cards: Card[]) {
    this.addToCards(...cards);

    makeObservable<Stock, "_waste">(this, {
      _waste: observable,
      addToWaste: action,
      addToCards: action,
      popWaste: action,
    });
  }

  get cards() {
    return this._cards;
  }

  get waste() {
    return this._waste;
  }

  reset(cards: Card[], waste: Card[]) {
    this._cards = cards;
    this._waste = waste;
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

  popWaste() {
    return this.waste.pop();
  }
}

interface StockProperties {
  cards: Card[];
  gameState: GameState;
}

export class StockWithTransfer
  extends Stock
  implements IHistoryConsumer, ITransferConsumer
{
  private _gameState: GameState;

  constructor(properties: StockProperties) {
    const { gameState, cards } = properties;

    super(cards);

    this._gameState = gameState;
  }

  /** add cards to transfer */
  addToTransfer() {
    this._gameState.transfer.addCards(this, this.waste.slice(-1));
  }

  removeTransferredCards() {
    this._gameState.history.setHistoryFrom(this, this.getDataForHistory());
    this.popWaste();
    this._gameState.score.moveFromWaste();
  }

  addToWaste() {
    this._gameState.history.setHistorySingle(this, this.getDataForHistory());

    super.addToWaste();
  }

  getDataForHistory() {
    return {
      waste: this.waste.map((c) => c.clone()),
      cards: this.cards.map((c) => c.clone()),
    };
  }

  applyFromHistory(data?: { cards?: Card[]; waste?: Card[] }) {
    const { cards, waste } = data || {};

    if (waste && cards) {
      this.reset(cards, waste);
    }
  }
}

interface StockWithStorageProperties extends StockProperties {
  storage: GameStorage<"stock">;
}

export class StockWithStorage extends StockWithTransfer {
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
      this._waste = Card.fromArray(this.savedState.waste);
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

  applyFromHistory(data?: Record<string, unknown>) {
    super.applyFromHistory(data);

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
