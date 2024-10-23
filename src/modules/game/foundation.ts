import { makeObservable, observable, action } from "mobx";
import { Card, Suit, Type, TYPE_ORDER } from "./card";
import { GameStorage } from "./storage";
import { GameState } from "./game";
import { IHistoryConsumer } from "./history";
import { ITransferConsumer } from "./transfer";

type Columns = [Card[], Card[], Card[], Card[]];

export class Foundation {
  protected _columns: Columns;
  protected _currentSuit?: Suit;
  protected _isWin: boolean = false;

  constructor() {
    this._columns = [[], [], [], []];

    makeObservable<Foundation, "_columns" | "_isWin">(this, {
      _columns: observable,
      _isWin: observable,
      reset: action,
      addCardsToColumn: action,
      removeCardsFromColumn: action,
    });
  }

  get columns() {
    return this._columns;
  }
  get currentSuit() {
    return this._currentSuit;
  }
  get isWin() {
    return this._isWin;
  }

  reset(columns: Columns) {
    this._columns = columns;
  }

  checkIsWin() {
    this._isWin =
      this._columns.reduce((sum, col) => sum + col.length, 0) === 52;
  }

  addCardsToColumn(columnIndex: number, cards: Card[]) {
    this._columns[columnIndex].push(...cards);
    this.checkIsWin();
  }

  removeCardsFromColumn(columnIndex: number, cardIndex: number) {
    this._columns[columnIndex].splice(cardIndex);
    this.checkIsWin();
  }

  checkRules(column: Card[], card?: Card): boolean {
    if (!card) {
      return false;
    }

    if (!column.length && card?.type === Type.ACE) {
      this._currentSuit = card.suit;

      return true;
    }

    const [lastCard] = column.slice(-1) as [Card | undefined];

    if (card?.suit !== lastCard?.suit) {
      return false;
    }

    if (TYPE_ORDER[card.type] - TYPE_ORDER[lastCard.type] === 1) {
      return true;
    }

    return false;
  }
}

interface FoundationProperties {
  gameState: GameState;
}

export class FoundationWithTransfer
  extends Foundation
  implements IHistoryConsumer, ITransferConsumer
{
  private _gameState: GameState;
  private _cardIndex?: number;
  private _columnIndex?: number;

  constructor(properties: FoundationProperties) {
    const { gameState: appState } = properties;

    super();

    this._gameState = appState;

    makeObservable(this, {
      addCardsFromTransfer: action,
      removeTransferredCards: action,
    });
  }

  addToTransfer(cardIndex: number, columnIndex: number) {
    this._cardIndex = cardIndex;
    this._columnIndex = columnIndex;

    this._gameState.transfer.addCards(
      this,
      this._columns[columnIndex].slice(cardIndex)
    );
  }

  removeTransferredCards() {
    const i = this._cardIndex;
    const j = this._columnIndex;

    if (i === undefined || j === undefined) {
      throw Error("Missed _cardIndexInTransfer");
    }

    this._gameState.history.setHistoryFrom(this, this.getDataForHistory());

    this.removeCardsFromColumn(j, i);

    this._cardIndex = undefined;
    this._columnIndex = undefined;

    this._gameState.score.removeFromFoundation();
  }

  addCardsFromTransfer(columnIndex: number) {
    const [firstCard] = this._gameState.transfer.cards;

    if (!this.checkRules(this._columns[columnIndex], firstCard)) {
      return false;
    }

    this._gameState.history.setHistoryTo(this, this.getDataForHistory(true));
    this._gameState.score.addToFoundation();

    const cards = this._gameState.transfer.getCardAndRestTransfer();

    cards.forEach((card) => card.openCard());

    this.addCardsToColumn(columnIndex, cards);

    return true;
  }

  getDataForHistory(withScore?: boolean) {
    return {
      columns: [...this._columns].map((c) => c.map((card) => card.clone())),
      ...(withScore ? { score: this._gameState.score.total } : {}),
    };
  }

  applyFromHistory(data?: { columns?: Columns; score?: number }) {
    const { columns, score } = data || {};

    if (columns) {
      this.reset(columns);
    }

    if (typeof score !== "undefined") {
      this._gameState.score.replaceTotal(score);
    }
  }
}

interface FoundationWithStoreProperties extends FoundationProperties {
  storage: GameStorage<"foundation">;
}

export class FoundationWithStorage extends FoundationWithTransfer {
  private _storage: GameStorage<"foundation">;

  static clearState(storage: GameStorage<"foundation">) {
    storage.removeItem("foundation");
  }

  constructor({ storage, ...rest }: FoundationWithStoreProperties) {
    super(rest);

    this._storage = storage;

    if (this.savedState) {
      this.savedState.columns.forEach((cards, i) => {
        this.addCardsToColumn(i, Card.fromArray(cards));
      });
    }
  }

  addCardsFromTransfer(columnIndex: number) {
    const status = super.addCardsFromTransfer(columnIndex);
    if (status) {
      this.saveState();
    }
    return status;
  }

  removeTransferredCards() {
    super.removeTransferredCards();
    this.saveState();
  }

  applyFromHistory(data?: { columns?: Columns; score?: number }) {
    super.applyFromHistory(data);
    this.saveState();
  }

  saveState() {
    this._storage.putToStorage("foundation", {
      columns: this._columns,
    });
  }

  get savedState() {
    return this._storage.getFromStorage<{ columns: Columns }>("foundation");
  }
}
