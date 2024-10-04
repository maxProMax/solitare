import { Card, Suit, Type } from "./card";
import { Score } from "./score";
import { Stock, StockWithStorage } from "./stock";
import { GameStorage } from "./storage";
import { Transfer } from "./transfer";

describe("Stock", () => {
  let transfer: Transfer;
  let stock: Stock;

  beforeEach(() => {
    transfer = new Transfer();
    stock = new Stock({
      transfer,
      score: new Score(),
      cards: [
        new Card({ suit: Suit.CLUBS, type: Type.ACE }),
        new Card({ suit: Suit.DIAMONDS, type: Type.TEN }),
      ],
    });
  });

  it("waste", () => {
    expect(stock.waste).toHaveLength(0);

    stock.addToWaste();

    expect(stock.waste).toHaveLength(1);
  });

  it("addToTransfer and removeTransferredCards", () => {
    stock.addToWaste();
    stock.addToTransfer();

    expect(stock.waste).toHaveLength(1);
    expect(transfer.cards).toHaveLength(1);

    stock.removeTransferredCards();

    expect(stock.waste).toHaveLength(0);
  });
});

describe("StockWithStorage", () => {
  let transfer: Transfer;
  let score: Score;
  let storage: GameStorage;

  const mockedLocalStorage = {
    length: 0,
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    transfer = new Transfer();
    score = new Score();
    storage = new GameStorage(mockedLocalStorage);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("init", () => {
    const cards = [
      new Card({ suit: Suit.CLUBS, type: Type.ACE }),
      new Card({ suit: Suit.DIAMONDS, type: Type.TEN }),
    ];

    const stock = new StockWithStorage({ transfer, cards, score, storage });

    expect(stock.cards).toHaveLength(2);
    expect(stock.waste).toHaveLength(0);
  });

  it("init with saved data", () => {
    const [card1, card2] = [
      new Card({ suit: Suit.CLUBS, type: Type.ACE }),
      new Card({ suit: Suit.DIAMONDS, type: Type.TEN }),
    ];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ cards: [card1], waste: [card2] })
    );

    const stock = new StockWithStorage({ transfer, cards: [], score, storage });

    expect(stock.cards).toHaveLength(1);
    expect(stock.waste).toHaveLength(1);
    expect(stock.cards[0].suit).toBe(card1.suit);
    expect(stock.waste[0].suit).toBe(card2.suit);
  });

  it("addToWaste", () => {
    const [card1] = [new Card({ suit: Suit.CLUBS, type: Type.ACE })];

    const stock = new StockWithStorage({
      transfer,
      cards: [card1],
      score,
      storage,
    });

    stock.addToWaste();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "stock",
      JSON.stringify({ cards: stock.cards, waste: stock.waste })
    );
  });

  it("removeTransferredCards", () => {
    const [card1, card2] = [
      new Card({ suit: Suit.CLUBS, type: Type.ACE }),
      new Card({ suit: Suit.DIAMONDS, type: Type.TEN }),
    ];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ cards: [], waste: [card1] })
    );

    const stock = new StockWithStorage({
      transfer,
      cards: [card2],
      score,
      storage,
    });

    stock.removeTransferredCards();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "stock",
      JSON.stringify({ cards: [], waste: [] })
    );
  });

  it("saveState", () => {
    const [card1] = [new Card({ suit: Suit.CLUBS, type: Type.ACE })];

    const stock = new StockWithStorage({
      transfer,
      cards: [card1],
      score,
      storage,
    });

    stock.saveState();

    expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
      "stock",
      JSON.stringify({ cards: [card1], waste: [] })
    );
  });

  it("savedState", () => {
    const [card1] = [new Card({ suit: Suit.CLUBS, type: Type.ACE })];

    mockedLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ cards: [], waste: [card1] })
    );

    const stock = new StockWithStorage({
      transfer,
      cards: [],
      score,
      storage,
    });

    expect(stock.savedState).toEqual({
      cards: [],
      waste: [JSON.parse(JSON.stringify(card1))],
    });
  });
});
