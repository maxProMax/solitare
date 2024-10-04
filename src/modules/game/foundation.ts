import { makeObservable, observable, action } from "mobx";
import { Card, Suit, Type, TYPE_ORDER } from "./card";

import { Transfer } from "./transfer";
import { Score } from "./score";
import { GameStorage } from "./storage";

type Columns = [Card[], Card[], Card[], Card[]];

export class Foundation {
  private _columns: Columns;
  private _currentSuit?: Suit;

  private _isWin: boolean = false;

  constructor() {
    this._columns = [[], [], [], []];

    makeObservable<Foundation, "_columns" | "_isWin">(this, {
      _columns: observable,
      _isWin: observable,
    });
  }

  get isWin() {
    return this._isWin;
  }

  set currentSuit(suit: Suit) {
    this._currentSuit = suit;
  }

  get currentSuit(): Suit | undefined {
    return this._currentSuit;
  }

  get columns() {
    return this._columns;
  }

  checkIsWin() {
    this._isWin =
      this._columns.reduce((sum, col) => sum + col.length, 0) === 52;
  }

  addCardsToColumn(columnIndex: number, cards: Card[]) {
    this.columns[columnIndex].push(...cards);
    this.checkIsWin();
  }

  removeCardsFromColumn(columnIndex: number, cardIndex: number) {
    this.columns[columnIndex].splice(cardIndex);
    this.checkIsWin();
  }

  checkRules(column: Card[], card?: Card): boolean {
    if (!card) {
      return false;
    }

    if (!column.length && card?.type === Type.ACE) {
      this.currentSuit = card.suit;

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

export class FoundationWithTransfer extends Foundation {
  private _transfer: Transfer;
  private _cardIndex?: number;
  private _columnIndex?: number;

  constructor(transfer: Transfer) {
    super();

    this._transfer = transfer;

    makeObservable(this, {
      addCardsFromTransfer: action,
      removeTransferredCards: action,
    });
  }

  addToTransfer(cardIndex: number, columnIndex: number) {
    this._cardIndex = cardIndex;
    this._columnIndex = columnIndex;

    this._transfer.addCards(this, this.columns[columnIndex].slice(cardIndex));
  }

  removeTransferredCards() {
    const i = this._cardIndex;
    const j = this._columnIndex;

    if (i === undefined || j === undefined) {
      throw Error("Missed _cardIndexInTransfer");
    }

    this.removeCardsFromColumn(j, i);

    this._cardIndex = undefined;
    this._columnIndex = undefined;
  }

  addCardsFromTransfer(columnIndex: number) {
    const [firstCard] = this._transfer.cards;

    if (!this.checkRules(this.columns[columnIndex], firstCard)) {
      throw Error("Not satisfy rules");
    }

    const cards = this._transfer.getCardAndRestTransfer();

    cards.forEach((card) => card.openCard());

    this.addCardsToColumn(columnIndex, cards);
  }
}

export class FoundationWithScore extends FoundationWithTransfer {
  private _score: Score;

  constructor({ score, transfer }: { score: Score; transfer: Transfer }) {
    super(transfer);

    this._score = score;
  }

  removeTransferredCards() {
    super.removeTransferredCards();

    this._score.removeFromFoundation();
  }

  addCardsFromTransfer(columnIndex: number) {
    try {
      super.addCardsFromTransfer(columnIndex);

      this._score.addToFoundation();
    } catch {}
  }
}

export class FoundationWithStorage extends FoundationWithScore {
  private _storage: GameStorage<"foundation">;

  static clearState(storage: GameStorage<"foundation">) {
    storage.removeItem("foundation");
  }

  constructor({
    score,
    transfer,
    storage,
  }: {
    score: Score;
    transfer: Transfer;
    storage: GameStorage<"foundation">;
  }) {
    super({ score, transfer });

    this._storage = storage;

    if (this.savedState) {
      this.savedState.columns.forEach((cards, i) => {
        this.addCardsToColumn(i, cards);
      });
    }
  }

  addCardsFromTransfer(columnIndex: number) {
    super.addCardsFromTransfer(columnIndex);

    this.saveState();
  }

  removeTransferredCards() {
    super.removeTransferredCards();
    this.saveState();
  }

  saveState() {
    this._storage.putToStorage("foundation", {
      columns: this.columns,
    });
  }

  get savedState() {
    return this._storage.getFromStorage<{ columns: Columns }>("foundation");
  }
}
