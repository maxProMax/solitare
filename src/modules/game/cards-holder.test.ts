import { CardsHolder } from "./cards-holder";
import { Transfer } from "./transfer";
import { Card, Suit, Type } from "./card";

describe("CardsHolder", () => {
  let cardsHolder: CardsHolder;
  let transfer: Transfer;

  beforeEach(() => {
    transfer = new Transfer();
    cardsHolder = new CardsHolder(transfer);

    cardsHolder.addToCards(...[new Card(Suit.CLUBS, Type.ACE)]);
  });

  it("addToTransfer", () => {
    const cards = [
      new Card(Suit.HEARTS, Type.TEN),
      new Card(Suit.DIAMONDS, Type.SEVEN),
    ];
    cardsHolder.addToCards(...cards);
    cardsHolder.addToTransfer(1); // 1 - game card index

    expect(transfer.cards).toHaveLength(2);
    expect(transfer.cards[0].suit).toBe(Suit.HEARTS);
  });

  it("removeTransferredCards exception", () => {
    const base = new CardsHolder(new Transfer());

    base.addToCards(...[new Card(Suit.CLUBS, Type.ACE)]);

    expect(() => base.removeTransferredCards()).toThrow();
  });

  it("removeTransferredCards 1 card in stock", () => {
    cardsHolder.addToTransfer(0); // 1 - game card index
    cardsHolder.removeTransferredCards();

    expect(transfer.cards).toHaveLength(1);
    expect(cardsHolder.cardIndexInTransfer).toBeUndefined();
  });

  it("last card inverted", () => {
    const lastCard = new Card(Suit.DIAMONDS, Type.SEVEN);

    cardsHolder.addToCards(lastCard);
    cardsHolder.openLastCard();

    expect(lastCard.isOpen).toBeTruthy();
  });
});
