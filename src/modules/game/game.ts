import { makeAutoObservable } from "mobx";
import { Deck } from "./deck";
import { Transfer } from "./transfer";
import { PileWithTransfer, PileWithStorage } from "./pile";
import { StockWithStorage } from "./stock";
import { FoundationWithStorage } from "./foundation";
import { ScoreWithStorage, InitScore, ResetScore } from "./score";
import { GameStorage } from "./storage";
import { Card, Suit, Type, TYPE_ORDER } from "./card";

export class Game {
  deck: Deck;
  piles?: PileWithStorage[];
  transfer: Transfer = new Transfer();
  foundation?: FoundationWithStorage;
  stock?: StockWithStorage;
  score: ScoreWithStorage;

  private _storage: GameStorage;

  constructor(storage?: Storage) {
    this._storage = new GameStorage(storage);
    this.score = new InitScore();

    this.deck = this.createDeck();
    this.foundation = this.createFoundation();
    this.piles = this.createPiles();
    this.stock = this.createStock();

    makeAutoObservable(this);

    // this.generateWinningSet();
  }

  private createDeck() {
    return new Deck();
  }

  private createFoundation() {
    return new FoundationWithStorage({
      transfer: this.transfer,
      score: this.score,
      storage: this._storage,
    });
  }

  private createPiles() {
    return PileWithTransfer.pileAmounts.map(
      (amount, i) =>
        new PileWithStorage({
          transfer: this.transfer,
          score: this.score,
          cards: this.deck.getCards(amount),
          pileIndex: i,
          storage: this._storage,
        })
    );
  }

  private createStock() {
    return new StockWithStorage({
      transfer: this.transfer,
      score: this.score,
      cards: this.deck.getAllCards(),
      storage: this._storage,
    });
  }

  reset() {
    FoundationWithStorage.clearState(this._storage);
    StockWithStorage.clearState(this._storage);
    PileWithStorage.clearState(this._storage);

    this.score = new ResetScore();

    this.deck = this.createDeck();
    this.foundation = this.createFoundation();
    this.piles = this.createPiles();
    this.stock = this.createStock();
  }

  resetScore() {
    this._storage.clear();

    this.score = new InitScore();

    this.deck = this.createDeck();
    this.foundation = this.createFoundation();
    this.piles = this.createPiles();
    this.stock = this.createStock();
  }

  generateWinningSet() {
    const columns = [];
    const sortedOrder = Object.entries(TYPE_ORDER).toSorted(
      (a, b) => a[1] - b[1]
    );
    let lastCard: Card | undefined;

    for (const suit of Object.values(Suit)) {
      const column = [];

      for (const [type] of sortedOrder) {
        if (columns.length === 3 && type === Type.KING) {
          lastCard = new Card({ suit, type: type as Type, isOpen: true });
        } else {
          column.push(new Card({ suit, type: type as Type, isOpen: true }));
        }
      }

      columns.push(column);
    }

    this._storage.putToStorage("foundation", { columns });
    this._storage.putToStorage("stock", { cards: [], waste: [] });
    this._storage.putToStorage("pile", {
      "0": [lastCard],
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
      "6": [],
      "7": [],
    });
  }
}
