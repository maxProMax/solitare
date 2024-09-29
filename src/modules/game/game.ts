import { makeObservable, observable, action, makeAutoObservable } from "mobx";
import { Card, Suit, Type, TYPE_ORDER } from "./card";
import { Deck } from "./deck";
import { Transfer } from "./transfer";
import { Pile } from "./pile";
import { Stock } from "./stock";

export class Foundation {
  private _transfer: Transfer;
  private _columns: [Card[], Card[], Card[], Card[]];
  private _currentSuit?: Suit;

  constructor(transfer: Transfer) {
    this._transfer = transfer;
    this._columns = [[], [], [], []];

    makeAutoObservable(this);
  }

  set currentSuit(suit: Suit) {
    this._currentSuit = suit;
  }
  get currentSuit(): Suit | undefined {
    return this._currentSuit;
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

  addCards(idx: number) {
    const [firstCard] = this._transfer.cards;

    if (!this.checkRules(this._columns[idx], firstCard)) {
      return;
    }

    this._transfer.fromInstance?.removeTransferredCards();

    const cards = this._transfer.getCardAndRestTransfer();

    cards.forEach((card) => {
      card.openCard();
    });

    this.columns[idx].push(...cards);
  }

  get columns() {
    return this._columns;
  }
}

export class Game {
  deck: Deck;
  piles?: Pile[];
  transfer: Transfer = new Transfer();
  foundation?: Foundation;
  stock?: Stock;

  constructor() {
    this.deck = new Deck(this.transfer);

    this.start();
  }

  start() {
    this.foundation = new Foundation(this.transfer);

    this.piles = Pile.pileAmounts.map(
      (amount) => new Pile(this.deck.getCards(amount), this.transfer)
    );

    this.stock = new Stock(this.transfer, this.deck.getAllCards());
  }

  restart() {
    this.deck = new Deck(this.transfer);

    this.start();
  }
}

export default new Game();
