import { Game } from "./game";
import { Deck } from "./deck";
import { Type } from "./card";

const mockLocalStorage = {
  length: 0,
  clear: jest.fn(),
  getItem: jest.fn(),
  key: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
};

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
    const game = new Game(mockLocalStorage);

    const [lastCard] = game?.piles?.[4].cards.slice(-1) || [];

    expect(game.stock?.cards).toHaveLength(24);
    expect(game.stock?.waste).toHaveLength(0);
    expect(game.piles?.[0].cards[0].type).toBe(Type.TEN);
    expect(game.piles?.[6].cards).toHaveLength(7);
    expect(lastCard.isOpen).toBeTruthy();
    expect(game.piles?.[4].cards[1].isOpen).toBeFalsy();
  });

  test("init savedState", () => {
    const saveData: { cards?: [] }[] = [];

    mockLocalStorage.setItem = jest.fn((k, v) => saveData.push(JSON.parse(v)));

    new Game(mockLocalStorage);

    expect(
      saveData.reduce((sum, item) => {
        if ("cards" in item) {
          return sum + (item.cards?.length || 0);
        }

        Object.values(item).forEach((cards) => {
          sum += cards?.length || 0;
        });

        return sum;
      }, 0)
    ).toBe(52);
  });

  it("reset", () => {
    const game = new Game();

    jest.restoreAllMocks();

    game.stock?.addToWaste();

    game.reset();

    expect(game.stock?.waste).toHaveLength(0);
  });
});
