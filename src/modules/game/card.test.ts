import { Card, Suit, Type } from "./card";

describe("Card", () => {
  it("suits", () => {
    const card = new Card({ suit: Suit.CLUBS, type: Type.KING });

    expect(card.suit).toBe(Suit.CLUBS);
    expect(card.type).toBe(Type.KING);
  });
});
