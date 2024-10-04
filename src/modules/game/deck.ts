import { makeObservable, action, observable } from "mobx";
import random from "lodash/random";
import { Suit, Type, Card } from "./card";

export class Deck {
  private _cards: Card[] = [];

  constructor() {
    const tempCards: (Card | null)[] = [];
    const cards: Card[] = [];

    for (const [, type] of Object.entries(Type)) {
      for (const [, suit] of Object.entries(Suit)) {
        tempCards.push(new Card({ suit, type }));
      }
    }

    while (tempCards.length !== cards.length) {
      const i = this.getIdx();

      if (tempCards.length === cards.length) {
        break;
      }

      if (tempCards[i]) {
        const { suit, type } = tempCards[i];
        cards.push(new Card({ suit, type }));
        tempCards[i] = null;
        continue;
      }

      if (tempCards.length - cards.length === 1) {
        const card = tempCards.find((c) => c);

        if (card) {
          const { suit, type } = card;
          cards.push(new Card({ suit, type }));

          break;
        }
      }
    }

    this.addToCards(...cards);

    makeObservable<Deck, "_cards">(this, {
      _cards: observable,
      addToCards: action,
      getCards: action,
      removeAllCards: action,
    });
  }

  get cards() {
    return this._cards;
  }

  addToCards(...cards: Card[]) {
    this._cards.push(...cards);
  }

  getIdx() {
    return random(0, 51);
  }

  /** Get cards by fixed amount */
  getCards(amount: number): Card[] {
    return this._cards.splice(0, amount);
  }

  removeAllCards() {
    this._cards = [];
  }

  getAllCards() {
    const cards = this._cards;

    this.removeAllCards();

    return cards;
  }
}
