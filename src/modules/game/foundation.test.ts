import { PileWithTransfer } from "./pile";
import { Transfer } from "./transfer";
import { Card, Suit, Type } from "./card";
import {
  FoundationWithTransfer,
  FoundationWithStorage,
  Foundation,
} from "./foundation";
import { Score } from "./score";
import { GameStorage } from "./storage";
import { Stock } from "./stock";

describe("Foundation", () => {
  test("checkRules", () => {
    const f = new Foundation();

    expect(
      f.checkRules([], new Card({ suit: Suit.CLUBS, type: Type.EIGHT }))
    ).toBeFalsy();
    expect(
      f.checkRules([], new Card({ suit: Suit.CLUBS, type: Type.ACE }))
    ).toBeTruthy();
    expect(
      f.checkRules(
        [new Card({ suit: Suit.CLUBS, type: Type.ACE })],
        new Card({ suit: Suit.CLUBS, type: Type.EIGHT })
      )
    ).toBeFalsy();
    expect(
      f.checkRules(
        [new Card({ suit: Suit.CLUBS, type: Type.ACE })],
        new Card({ suit: Suit.CLUBS, type: Type.TWO })
      )
    ).toBeTruthy();
  });
});

describe("FoundationWithTransfer", () => {
  let transfer: Transfer;

  beforeEach(() => {
    transfer = new Transfer();
  });

  it("addCards no cards in transfer", () => {
    const foundation = new FoundationWithTransfer(new Transfer());
    const COL_INDX = 0;

    foundation.addCardsFromTransfer(COL_INDX);

    expect(foundation.columns[COL_INDX]).toHaveLength(0);
  });

  it("addCards first card not ACE", () => {
    const pile = new PileWithTransfer({
      transfer,
      score: new Score(),
      cards: [new Card({ suit: Suit.HEARTS, type: Type.TEN })],
    });

    pile.addToTransfer(0);

    const foundation = new FoundationWithTransfer(new Transfer());
    const COL_INDX = 1;

    expect(foundation.columns[COL_INDX]).toHaveLength(0);
  });

  it("addCards first card - ACE", () => {
    const pile = new PileWithTransfer({
      transfer,
      score: new Score(),
      cards: [new Card({ suit: Suit.HEARTS, type: Type.ACE })],
    });

    pile.addToTransfer(0);

    const foundation = new FoundationWithTransfer(transfer);
    const COL_INDX = 1;

    foundation.addCardsFromTransfer(COL_INDX);

    expect(foundation.columns[COL_INDX]).toHaveLength(1);
    expect(foundation.currentSuit).toBe(Suit.HEARTS);

    const [card] = foundation.columns[COL_INDX];

    expect(card.isOpen).toBeTruthy();

    expect(pile.cards).toHaveLength(0);
  });
});

describe("FoundationWithStorage", () => {
  let storage: GameStorage;
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
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ columns: [[card1], [], [], []] })
    );

    const foundation = new FoundationWithStorage({ transfer, storage, score });

    expect(foundation.columns[0]).toHaveLength(1);
  });

  test("init", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ columns: [[card1], [], [], []] })
    );

    const foundation = new FoundationWithStorage({ transfer, storage, score });

    expect(foundation.columns[0]).toHaveLength(1);
  });

  test("addCardsFromTransfer", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];
    const stock = new Stock({ transfer, score, cards: [card1] });

    stock.addToWaste();
    stock.addToTransfer();

    const foundation = new FoundationWithStorage({ transfer, storage, score });

    foundation.addCardsFromTransfer(0);

    expect(foundation.columns[0]).toHaveLength(1);
    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "foundation",
      JSON.stringify({ columns: [[card1], [], [], []] })
    );
  });

  test("removeTransferredCards", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ columns: [[card1], [], [], []] })
    );

    const foundation = new FoundationWithStorage({ transfer, storage, score });

    foundation.addToTransfer(0, 0);
    foundation.removeTransferredCards();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "foundation",
      JSON.stringify({ columns: [[], [], [], []] })
    );
  });
  test("saveState", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ columns: [[card1], [], [], []] })
    );

    const foundation = new FoundationWithStorage({ transfer, storage, score });

    jest.resetAllMocks();

    foundation.saveState();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "foundation",
      JSON.stringify({ columns: [[card1], [], [], []] })
    );
  });
});
