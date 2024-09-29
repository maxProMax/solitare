import { makeAutoObservable, makeObservable, action, observable } from "mobx";
import { Card } from "./card";
import { CardsHolder } from "./cards-holder";
import { Transfer } from "./transfer";

export class Stock extends CardsHolder {
  private _waste: Card[] = [];

  constructor(transfer: Transfer, cards: Card[]) {
    super(transfer);

    const [lastCard] = cards.splice(-1);

    lastCard.openCard();

    this._waste.push(lastCard);
    this.addToCards(...cards);

    makeObservable<Stock, "_waste">(this, {
      _waste: observable,
      addToWaste: action,
    });
  }

  get waste() {
    return this._waste;
  }

  addToWaste() {
    const lastCard = this.cards.pop();

    if (lastCard) {
      lastCard.openCard();
      this._waste.push(lastCard);
    }
  }

  /** add cards to transfer */
  addToTransfer() {
    this.transfer.addCards(this, this._waste.slice(-1));
  }

  removeTransferredCards() {
    this._waste.pop();
  }
}
