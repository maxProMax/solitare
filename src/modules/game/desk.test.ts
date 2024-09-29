import { Deck } from "./deck";
import { Transfer } from "./transfer";

describe("Desk", () => {
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

  it("check desk", () => {
    const deck = new Deck(new Transfer());

    expect(deck.cards).toMatchSnapshot();
    expect(2).toBe(2);
  });

  it("get 5 cards", () => {
    const deck = new Deck(new Transfer());

    deck.getCards(5);

    expect(deck.cards).toHaveLength(47);
  });
});
