import { Card } from "./card";

/**
 * Temporary state between transferring cards
 */
// fromInstance?.removeTransferredCards();
interface CardsHolder {
  removeTransferredCards: () => void;
}

export class Transfer {
  private _cards: Card[] = [];
  private _fromInstance?: CardsHolder;

  set cards(cards: Card[]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  get fromInstance() {
    return this._fromInstance;
  }

  addCards(fromInstance: CardsHolder, cards: Card[]) {
    this._cards = cards;
    this._fromInstance = fromInstance;
  }

  getCardAndRestTransfer() {
    const cards = this._cards;

    this._cards = [];

    this._fromInstance = undefined;

    return cards;
  }
}
