import { Card, Suit, Type } from "./card";

describe("Card", () => {
  it("suits", () => {
    const card = new Card(Suit.CLUBS, Type.KING);

    expect(card.suit).toBe(Suit.CLUBS);
    expect(card.type).toBe(Type.KING);
  });
});
