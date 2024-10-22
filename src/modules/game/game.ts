import { makeAutoObservable } from "mobx";
import { Deck } from "./deck";
import { Transfer } from "./transfer";
import { History } from "./history";
import { PileWithTransfer, PileWithStorage } from "./pile";
import { StockWithStorage } from "./stock";
import { FoundationWithStorage } from "./foundation";
import { InitScore, ResetScore, Score } from "./score";
import { GameStorage } from "./storage";
import { Card, Suit, Type, TYPE_ORDER } from "./card";

interface GameStateProperties {
  score?: Score;
  storage?: Storage;
}

export class GameState {
  private _transfer: Transfer = new Transfer();
  private _history: History = new History();
  private _score: Score;

  constructor(properties?: GameStateProperties) {
    const { score = new Score() } = properties || {};

    this._score = score;
  }

  get transfer() {
    return this._transfer;
  }

  get history() {
    return this._history;
  }

  get score() {
    return this._score;
  }
}

class Helper_3d {
  onUpAction?: () => boolean;
}

export class Game {
  deck: Deck;
  piles?: PileWithStorage[];
  foundation?: FoundationWithStorage;
  stock?: StockWithStorage;
  helper_3d: Helper_3d;

  private _storage: GameStorage;
  private _gameState: GameState;

  constructor(storage?: Storage) {
    this._gameState = new GameState({ score: new InitScore() });
    this._storage = new GameStorage(storage);

    this.deck = this.createDeck();
    this.foundation = this.createFoundation();
    this.piles = this.createPiles();
    this.stock = this.createStock();
    this.helper_3d = new Helper_3d();

    makeAutoObservable(this);

    // this.generateWinningSet();
  }

  get gameState() {
    return this._gameState;
  }

  private createDeck() {
    return new Deck();
  }

  private createFoundation() {
    return new FoundationWithStorage({
      storage: this._storage,
      gameState: this._gameState,
    });
  }

  private createPiles() {
    return PileWithTransfer.pileAmounts.map(
      (amount, i) =>
        new PileWithStorage({
          cards: this.deck.getCards(amount),
          pileIndex: i,
          storage: this._storage,
          gameState: this._gameState,
        })
    );
  }

  private createStock() {
    return new StockWithStorage({
      cards: this.deck.getAllCards(),
      storage: this._storage,
      gameState: this._gameState,
    });
  }

  reset() {
    FoundationWithStorage.clearState(this._storage);
    StockWithStorage.clearState(this._storage);
    PileWithStorage.clearState(this._storage);

    this._gameState = new GameState({ score: new ResetScore() });

    this.deck = this.createDeck();
    this.foundation = this.createFoundation();
    this.piles = this.createPiles();
    this.stock = this.createStock();
  }

  resetScore() {
    this._storage.clear();

    this._gameState = new GameState({ score: new InitScore() });

    this.deck = this.createDeck();
    this.foundation = this.createFoundation();
    this.piles = this.createPiles();
    this.stock = this.createStock();
  }

  back() {
    this._gameState.history.historyBack();
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
