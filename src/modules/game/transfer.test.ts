import { Transfer } from "./transfer";
import { CardsHolder } from "./cards-holder";
import { Card, Suit, Type } from "./card";

describe("Transfer", () => {
  let transfer: Transfer;
  let cardsHolder: CardsHolder;

  beforeEach(() => {
    transfer = new Transfer();
    cardsHolder = new CardsHolder(transfer);

    cardsHolder.addToCards(
      ...[new Card(Suit.HEARTS, Type.TEN), new Card(Suit.DIAMONDS, Type.SEVEN)]
    );

    cardsHolder.addToTransfer(0);
  });

  it("addCards", () => {
    expect(transfer.fromInstance).toBe(cardsHolder);
    expect(transfer.cards).toHaveLength(2);
  });
  it("getCardAndRestTransfer", () => {
    const cards = transfer.getCardAndRestTransfer();

    expect(cards).toHaveLength(2);
    expect(cards[0].suit).toBe(Suit.HEARTS);
    expect(transfer.fromInstance).toBeUndefined();
  });
});
