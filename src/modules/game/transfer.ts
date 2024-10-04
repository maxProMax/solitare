import { Card } from "./card";

interface ICardsHolder {
  removeTransferredCards: () => void;
}

export class Transfer {
  private _cards: Card[] = [];
  private _fromInstance?: ICardsHolder;

  set cards(cards: Card[]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  get fromInstance() {
    return this._fromInstance;
  }

  addCards(fromInstance: ICardsHolder, cards: Card[]) {
    this._cards = cards;
    this._fromInstance = fromInstance;
  }

  getCardAndRestTransfer() {
    const cards = this._cards;

    this._cards = [];

    this.fromInstance?.removeTransferredCards?.();

    this._fromInstance = undefined;

    return cards;
  }
}
