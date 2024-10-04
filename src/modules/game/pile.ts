import { makeObservable, observable, action } from "mobx";
import { Card, Type, TYPE_ORDER, SUIT_COLORS, CardProperties } from "./card";
import { Transfer } from "./transfer";
import { Score } from "./score";
import { GameStorage } from "./storage";

export class Pile {
  private _cards: Card[] = [];

  static pileAmounts = [1, 2, 3, 4, 5, 6, 7];

  constructor(cards: Card[]) {
    this.addToCardsToPile(cards);

    makeObservable<Pile, "_cards">(this, {
      _cards: observable,
      addToCards: action,
    });
  }

  get cards() {
    return this._cards;
  }

  addToCards(...cards: Card[]) {
    this._cards.push(...cards);
  }

  removeAllCards() {
    this._cards = [];
  }

  addToCardsToPile(cards: Card[]): void {
    cards.forEach((card) => this.addToCards(card));

    this.openLastCard();
  }

  openLastCard() {
    const [lastCard] = this._cards.slice(-1);

    lastCard && lastCard?.openCard();
  }

  isLastCardClosed() {
    const [lastCard] = this._cards.slice(-1);

    return lastCard ? !lastCard.isOpen : false;
  }

  checkRules(card?: Card): boolean {
    if (!card) {
      return false;
    }

    if (!this._cards.length && card?.type === Type.KING) {
      return true;
    }

    const [lastCard] = this._cards.slice(-1) as [Card | undefined];

    if (!lastCard) {
      return false;
    }

    if (SUIT_COLORS[card.suit] === SUIT_COLORS[lastCard.suit]) {
      return false;
    }

    if (lastCard.type === Type.TWO && card.type === Type.ACE) {
      return true;
    }

    if (TYPE_ORDER[lastCard.type] - TYPE_ORDER[card.type] === 1) {
      return true;
    }

    return false;
  }
}

interface PileProperties {
  transfer: Transfer;
  score: Score;
  cards: Card[];
}

export class PileWithTransfer extends Pile {
  private _score: Score;
  private _transfer: Transfer;

  /** From which index cards in transfer */
  cardIndexInTransfer?: number;

  constructor(properties: PileProperties) {
    const { transfer, score, cards } = properties;

    super(cards);

    this._score = score;
    this._transfer = transfer;

    makeObservable(this, {
      removeTransferredCards: action,
    });
  }

  addCardsFromTransfer() {
    const [firstCard] = this._transfer.cards;

    if (!this.checkRules(firstCard)) {
      return;
    }

    const cards = this._transfer.getCardAndRestTransfer();

    cards.forEach((card) => card.openCard());

    this.addToCards(...cards);
  }

  /** add cards to transfer */
  addToTransfer(idx: number) {
    this.cardIndexInTransfer = idx;

    this._transfer.addCards(this, this.cards.slice(idx));
  }

  removeTransferredCards(): void {
    const i = this.cardIndexInTransfer;

    if (i === undefined) {
      throw Error("Missed _cardIndexInTransfer");
    }

    if (i === 0) {
      this.removeAllCards();
    } else if (i) {
      this.cards.splice(i);

      if (this.isLastCardClosed()) {
        this.openLastCard();
        this._score.openCard();
      }
    }

    this.cardIndexInTransfer = undefined;

    if (this._transfer.fromInstance !== this) {
      this._score.openCard();
    }
  }
}

interface PileWithStoreProperties extends PileProperties {
  pileIndex?: number;
  storage: GameStorage<"pile">;
}

export class PileWithStorage extends PileWithTransfer {
  private _pileIndex: number = 0;
  private _storage: GameStorage<"pile">;

  static clearState(storage: GameStorage<"pile">) {
    storage.removeItem("pile");
  }

  constructor(properties: PileWithStoreProperties) {
    const { cards, pileIndex = 0, storage, ...rest } = properties;

    super({ ...rest, cards: [] });

    this._storage = storage;
    this._pileIndex = pileIndex;

    this.populatedCards(cards);
  }

  populatedCards(cards: Card[]): void {
    if (this.savedState) {
      this.addToCards(...Card.fromArray(this.savedState));
    } else {
      this.addToCardsToPile(cards);
    }

    this.saveState();
  }

  addCardsFromTransfer() {
    super.addCardsFromTransfer();

    this.saveState();
  }

  removeTransferredCards(): void {
    super.removeTransferredCards();

    this.saveState();
  }

  private get savedAllPiles() {
    return this._storage.getFromStorage<Record<number, CardProperties[]>>(
      "pile"
    );
  }

  saveState() {
    this._storage.putToStorage("pile", {
      ...this.savedAllPiles,
      [this._pileIndex || 0]: this.cards,
    });
  }

  get savedState() {
    const data = this.savedAllPiles;

    return data?.[this._pileIndex];
  }
}
