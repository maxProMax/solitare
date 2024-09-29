import { Foundation, Game } from "./game";
import { CardsHolder } from "./cards-holder";
import { Transfer } from "./transfer";
import { Deck } from "./deck";
import { Card, Suit, Type } from "./card";

describe("game", () => {
  beforeEach(() => {
    const indexes = [
      51, 51, 51, 0, 50, 1, 49, 2, 48, 3, 47, 4, 46, 5, 45, 6, 44, 7, 43, 8, 42,
      9, 41, 10, 40, 11, 39, 12, 38, 13, 37, 14, 36, 15, 35, 16, 34, 17, 33, 18,
      32, 19, 31, 20, 30, 21, 29, 30, 30, 30, 22, 28, 23, 27, 24, 26, 25,
    ];
    jest
      .spyOn(Deck.prototype, "getIdx")
      .mockImplementation(() => indexes.shift() as number);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("init", () => {
    const game = new Game();

    const [lastCard] = game?.piles?.[4].cards.slice(-1) || [];

    expect(game.stock?.cards).toHaveLength(23);
    expect(game.stock?.waste).toHaveLength(1);
    expect(game.piles?.[0].cards[0].type).toBe(Type.TEN);
    expect(game.piles?.[6].cards).toHaveLength(7);
    expect(lastCard.isOpen).toBeTruthy();
    expect(game.piles?.[4].cards[1].isOpen).toBeFalsy();
  });

  describe("Foundation", () => {
    let transfer: Transfer;
    let cardsHolder: CardsHolder;

    beforeEach(() => {
      transfer = new Transfer();
      cardsHolder = new CardsHolder(transfer);
    });

    it("addCards no cards in transfer", () => {
      const foundation = new Foundation(new Transfer());
      const COL_INDX = 0;

      foundation.addCards(COL_INDX);

      expect(foundation.columns[COL_INDX]).toHaveLength(0);
    });

    it("addCards first card not ACE", () => {
      cardsHolder.addToCards(...[new Card(Suit.HEARTS, Type.TEN)]);

      cardsHolder.addToTransfer(0);

      const foundation = new Foundation(transfer);
      const COL_INDX = 1;

      expect(foundation.columns[COL_INDX]).toHaveLength(0);
    });

    it("addCards first card - ACE", () => {
      cardsHolder.addToCards(...[new Card(Suit.HEARTS, Type.ACE)]);

      cardsHolder.addToTransfer(0);

      const foundation = new Foundation(transfer);
      const COL_INDX = 1;

      foundation.addCards(COL_INDX);

      expect(foundation.columns[COL_INDX]).toHaveLength(1);
      expect(foundation.currentSuit).toBe(Suit.HEARTS);

      const [card] = foundation.columns[COL_INDX];

      expect(card.isOpen).toBeTruthy();

      expect(cardsHolder.cards).toHaveLength(0);
    });
    it("rule", () => {
      const foundation = new Foundation(new Transfer());

      expect(foundation.checkRules([])).toBeFalsy();
      expect(
        foundation.checkRules([], new Card(Suit.CLUBS, Type.TEN))
      ).toBeFalsy();
      const cards = [new Card(Suit.CLUBS, Type.ACE)];
      expect(
        foundation.checkRules(cards, new Card(Suit.CLUBS, Type.TEN))
      ).toBeFalsy();
      expect(
        foundation.checkRules(cards, new Card(Suit.CLUBS, Type.TWO))
      ).toBeTruthy();
    });
  });
});
