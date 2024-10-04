import { PileWithTransfer, PileWithStorage } from "./pile";
import { Transfer } from "./transfer";
import { Card, Suit, Type } from "./card";
import { Score } from "./score";
import { describe } from "node:test";
import { GameStorage } from "./storage";

describe("Pile", () => {
  test("last card inverted", () => {
    const lastCard = new Card({ suit: Suit.DIAMONDS, type: Type.SEVEN });

    new PileWithTransfer({
      transfer: new Transfer(),
      score: new Score(),
      cards: [
        new Card({ suit: Suit.CLUBS, type: Type.ACE }),
        new Card({ suit: Suit.HEARTS, type: Type.TEN }),
        lastCard,
      ],
    });

    expect(lastCard.isOpen).toBeTruthy();
  });

  test("checkRules", () => {
    const pile = new PileWithTransfer({
      transfer: new Transfer(),
      score: new Score(),
      cards: [],
    });

    expect(pile.checkRules()).toBeFalsy();
    expect(
      pile.checkRules(new Card({ suit: Suit.DIAMONDS, type: Type.SEVEN }))
    ).toBeFalsy();
    expect(
      pile.checkRules(new Card({ suit: Suit.DIAMONDS, type: Type.KING }))
    ).toBeTruthy();
    pile.addToCards(new Card({ suit: Suit.DIAMONDS, type: Type.KING }));

    expect(
      pile.checkRules(new Card({ suit: Suit.SPADES, type: Type.QUEEN }))
    ).toBeTruthy();
  });
  test("checkRules ace and two", () => {
    const pile = new PileWithTransfer({
      transfer: new Transfer(),
      score: new Score(),
      cards: [new Card({ suit: Suit.DIAMONDS, type: Type.TWO })],
    });

    expect(
      pile.checkRules(new Card({ suit: Suit.SPADES, type: Type.ACE }))
    ).toBeTruthy();
  });
});

describe("PileWithStorage", () => {
  let storage: GameStorage<"pile">;
  let transfer: Transfer;
  let score: Score;

  const mockedLocalStorage = {
    length: 0,
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    storage = new GameStorage(mockedLocalStorage);
    transfer = new Transfer();
    score = new Score();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("init", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.TWO })];
    const pile = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [card1],
    });

    expect(mockedLocalStorage.getItem).toHaveBeenCalled();
    expect(pile.cards).toHaveLength(1);
  });

  test("init from store", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.TWO })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ "0": [card1] })
    );

    const pile = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [],
    });

    expect(pile.cards).toHaveLength(1);
  });

  test("addCardsFromTransfer", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.KING })];

    const pile = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [],
      pileIndex: 0,
    });
    const pile2 = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [card1],
      pileIndex: 1,
    });

    pile2.addToTransfer(0);
    pile.addCardsFromTransfer();

    expect(pile.cards).toHaveLength(1);
    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "pile",
      JSON.stringify({ "0": [card1] })
    );
  });

  test("removeTransferredCards", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.KING })];

    const pile = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [card1],
      pileIndex: 0,
    });

    jest.resetAllMocks();

    pile.addToTransfer(0);
    pile.removeTransferredCards();

    expect(pile.cards).toHaveLength(0);
    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "pile",
      JSON.stringify({ "0": [] })
    );
  });

  test("removeTransferredCards", () => {
    const [card1, card2] = [
      new Card({ suit: Suit.DIAMONDS, type: Type.KING }),
      new Card({ suit: Suit.HEARTS, type: Type.KING }),
    ];

    const pile = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [card2],
      pileIndex: 1,
    });
    jest.resetAllMocks();

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ "0": [card1] })
    );

    pile.saveState();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "pile",
      JSON.stringify({ "0": [card1], "1": [card2] })
    );
  });

  test("remove last card", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.KING })];

    const pile = new PileWithStorage({
      storage,
      transfer,
      score,
      cards: [card1],
      pileIndex: 0,
    });

    pile.addToTransfer(0);

    jest.resetAllMocks();
    pile.removeTransferredCards();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "pile",
      JSON.stringify({ "0": [] })
    );
  });
});
