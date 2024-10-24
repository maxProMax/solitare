import { PileWithTransfer } from "./pile";
import { Card, Suit, Type } from "./card";
import {
  FoundationWithTransfer,
  FoundationWithStorage,
  Foundation,
} from "./foundation";
import { GameStorage } from "./storage";
import { StockWithTransfer } from "./stock";
import { GameState } from "./game";

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
  let appState: GameState;

  beforeEach(() => {
    appState = new GameState();
  });

  it("addCards no cards in transfer", () => {
    const foundation = new FoundationWithTransfer({
      gameState: new GameState(),
    });
    const COL_INDX = 0;

    foundation.addCardsFromTransfer(COL_INDX);

    expect(appState.transfer.cards).toHaveLength(0);
  });

  it("addCards first card not ACE", () => {
    const pile = new PileWithTransfer({
      gameState: appState,
      cards: [new Card({ suit: Suit.HEARTS, type: Type.TEN })],
    });

    pile.addToTransfer(0);

    const foundation = new FoundationWithTransfer({
      gameState: new GameState(),
    });
    const COL_INDX = 1;

    expect(foundation.columns[COL_INDX]).toHaveLength(0);
  });

  it("addCards first card - ACE", () => {
    const pile = new PileWithTransfer({
      gameState: appState,
      cards: [new Card({ suit: Suit.HEARTS, type: Type.ACE })],
    });

    pile.addToTransfer(0);

    const foundation = new FoundationWithTransfer({ gameState: appState });
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
  let appState: GameState;

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
    appState = new GameState();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("init", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ columns: [[card1], [], [], []] })
    );

    const foundation = new FoundationWithStorage({
      gameState: appState,
      storage,
    });

    expect(foundation.columns[0]).toHaveLength(1);
  });

  test("addCardsFromTransfer", () => {
    const [card1] = [new Card({ suit: Suit.DIAMONDS, type: Type.ACE })];
    const stock = new StockWithTransfer({
      gameState: appState,
      cards: [card1],
    });

    stock.addToWaste();
    stock.addToTransfer();

    const foundation = new FoundationWithStorage({
      gameState: appState,
      storage,
    });

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

    const foundation = new FoundationWithStorage({
      gameState: appState,
      storage,
    });

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

    const foundation = new FoundationWithStorage({
      gameState: appState,
      storage,
    });

    jest.resetAllMocks();

    foundation.saveState();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "foundation",
      JSON.stringify({ columns: [[card1], [], [], []] })
    );
  });
});
