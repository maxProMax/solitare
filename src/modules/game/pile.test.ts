import { Pile } from "./pile";
import { Transfer } from "./transfer";
import { Card, Suit, Type } from "./card";

describe("Pile", () => {
  it("last card inverted", () => {
    const lastCard = new Card(Suit.DIAMONDS, Type.SEVEN);

    new Pile(
      [
        new Card(Suit.CLUBS, Type.ACE),
        new Card(Suit.HEARTS, Type.TEN),
        lastCard,
      ],
      new Transfer()
    );

    expect(lastCard.isOpen).toBeTruthy();
  });
});
