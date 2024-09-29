import { makeObservable, observable, action } from "mobx";
import { Card } from "./card";
import { Transfer } from "./transfer";

export class CardsHolder {
  private _transfer: Transfer;
  private _cards: Card[] = [];
  /** From which index cards in transfer */
  cardIndexInTransfer?: number;

  constructor(transfer: Transfer) {
    this._transfer = transfer;

    makeObservable<CardsHolder, "_cards">(this, {
      _cards: observable,
      addToCards: action,
      removeTransferredCards: action,
    });
  }

  get cards() {
    return this._cards;
  }

  get transfer() {
    return this._transfer;
  }

  addToCards(...card: Card[]) {
    this._cards.push(...card);
  }

  removeAllCards() {
    this._cards = [];
  }

  openLastCard() {
    const [lastCard] = this.cards.slice(-1);

    lastCard?.openCard();
  }

  /** add cards to transfer */
  addToTransfer(idx: number) {
    this.cardIndexInTransfer = idx;

    this._transfer.addCards(this, this._cards.slice(idx));
  }

  removeTransferredCards() {
    const i = this.cardIndexInTransfer;

    if (i === undefined) {
      throw Error("Missed _cardIndexInTransfer");
    }

    if (i === 0) {
      this._cards = [];
    } else if (i) {
      this._cards.splice(i);

      this.openLastCard();
    }

    this.cardIndexInTransfer = undefined;
  }
}
