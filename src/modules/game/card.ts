import { makeAutoObservable } from "mobx";

export enum Suit {
  CLUBS = "♣️",
  DIAMONDS = "♦️",
  HEARTS = "♥️",
  SPADES = "♠️",
}

export enum Type {
  KING = "K",
  QUEEN = "Q",
  JACK = "J",
  ACE = "A",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
}

export const TYPE_ORDER = {
  [Type.ACE]: 0,
  [Type.TWO]: 1,
  [Type.THREE]: 2,
  [Type.FOUR]: 3,
  [Type.FIVE]: 4,
  [Type.SIX]: 5,
  [Type.SEVEN]: 6,
  [Type.EIGHT]: 7,
  [Type.NINE]: 8,
  [Type.TEN]: 9,
  [Type.JACK]: 10,
  [Type.QUEEN]: 11,
  [Type.KING]: 12,
};

/** 1 - red, 0 - black */
export const SUIT_COLORS = {
  [Suit.CLUBS]: 0,
  [Suit.DIAMONDS]: 1,
  [Suit.HEARTS]: 1,
  [Suit.SPADES]: 0,
};

export type CardProperties = {
  suit: Suit;
  type: Type;
  id?: string;
  isOpen?: boolean;
};

export class Card {
  id: string;
  suit: Suit;
  type: Type;
  isOpen = false;

  static fromArray(cards: CardProperties[]) {
    return cards.map((o) => new Card(o));
  }

  constructor(args: CardProperties) {
    const { suit, type, isOpen, id } = args;

    this.suit = suit;
    this.type = type;
    this.isOpen = isOpen || false;
    this.id = id || `${suit}_${type}`;

    makeAutoObservable(this);
  }

  openCard() {
    this.isOpen = true;

    return this.isOpen;
  }
}
