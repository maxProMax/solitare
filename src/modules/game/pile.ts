import { makeObservable, observable, action } from "mobx";
import { Card, Type, TYPE_ORDER, SUIT_COLORS, CardProperties } from "./card";
import { ITransferConsumer } from "./transfer";
import { IHistoryConsumer } from "./history";
import { GameStorage } from "./storage";
import { GameState } from "./game";

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

  reset(cards: Card[]) {
    this._cards = cards;
  }

  addToCards(...cards: Card[]) {
    this._cards.push(...cards);
  }

  removeAllCards() {
    this._cards = [];
  }

  addToCardsToPile(cards: Card[]): void {
    this.addToCards(...cards);

    this.openLastCard();
  }

  openLastCard() {
    const [lastCard] = this._cards.slice(-1);

    lastCard?.openCard();
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
  cards: Card[];
  gameState: GameState;
}

export class PileWithTransfer
  extends Pile
  implements IHistoryConsumer, ITransferConsumer
{
  protected _gameState: GameState;

  /** From which index cards in transfer */
  cardIndexInTransfer?: number;

  constructor(properties: PileProperties) {
    const { gameState, cards } = properties;

    super(cards);

    this._gameState = gameState;

    makeObservable(this, {
      removeTransferredCards: action,
    });
  }

  addCardsFromTransfer() {
    const [firstCard] = this._gameState.transfer.cards;

    if (!this.checkRules(firstCard)) {
      return false;
    }

    this._gameState.history.setHistoryTo(this, this.getDataForHistory(true));

    const cards = this._gameState.transfer.getCardAndRestTransfer();

    cards.forEach((card) => card.openCard());

    this.addToCards(...cards);

    return true;
  }

  /** add cards to transfer */
  addToTransfer(idx: number) {
    this.cardIndexInTransfer = idx;

    this._gameState.transfer.addCards(this, this.cards.slice(idx));
  }

  removeTransferredCards(): void {
    const i = this.cardIndexInTransfer;

    this.cardIndexInTransfer = undefined;

    if (i === undefined) {
      throw Error("Missed _cardIndexInTransfer");
    }

    this._gameState.history.setHistoryFrom(this, this.getDataForHistory());

    if (i === 0) {
      this.removeAllCards();
    } else if (i) {
      this.cards.splice(i);

      if (this.isLastCardClosed()) {
        this.openLastCard();
        this._gameState.score.openCard();
      }
    }

    if (this._gameState.transfer.fromInstance !== this) {
      this._gameState.score.openCard();
    }
  }

  getDataForHistory(withScore?: boolean) {
    return {
      cards: this.cards.map((c) => c.clone()),
      ...(withScore ? { score: this._gameState.score.total } : {}),
    };
  }

  applyFromHistory(data?: { cards?: Card[]; score?: number }) {
    const { cards, score } = data || {};

    cards && this.reset(Card.fromArray(cards));

    if (typeof score !== "undefined") {
      this._gameState.score.replaceTotal(score);
    }
  }
}

interface PileWithStoreProperties extends PileProperties {
  pileIndex?: number;
  storage: GameStorage<"pile">;
}

export class PileWithStorage extends PileWithTransfer {
  protected _pileIndex: number = 0;
  protected _storage: GameStorage<"pile">;

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
    const result = super.addCardsFromTransfer();

    if (result) {
      this.saveState();
    }

    return result;
  }

  removeTransferredCards(): void {
    super.removeTransferredCards();

    this.saveState();
  }

  applyFromHistory(data?: Record<string, unknown>) {
    super.applyFromHistory(data);

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
