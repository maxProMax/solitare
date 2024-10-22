import { Card } from "./card";

export interface ITransferConsumer {
  removeTransferredCards: () => void;
  backCards?: () => void;
}

export class Transfer {
  private _cards: Card[] = [];
  private _fromInstance?: ITransferConsumer;

  set cards(cards: Card[]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  get fromInstance() {
    return this._fromInstance;
  }

  addCards(fromInstance: ITransferConsumer, cards: Card[]) {
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
