import { render, screen } from "@testing-library/react";
import { StockComponent } from "./Stock";
import { Deck } from "@/modules/game/deck";
import { Stock } from "@/modules/game/stock";
import { Transfer } from "@/modules/game/transfer";

describe("StockComponent", () => {
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

  it("init render", () => {
    render(<StockComponent />);

    expect(screen.getByTestId("deck")).toBeInTheDocument();
  });

  it("with cards", () => {
    const transfer = new Transfer();
    const deck = new Deck(transfer);
    const stock = new Stock(transfer, deck.getAllCards());

    render(<StockComponent stock={stock} />);

    expect(screen.getAllByTestId("game-card")).toHaveLength(52);
  });
});
