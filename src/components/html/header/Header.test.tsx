import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { Game } from "@/modules/game/game";

describe("Header", () => {
  it("init", () => {
    const game = new Game();
    render(<Header game={game} />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("reset", () => {
    const game = new Game();
    game.reset = jest.fn();

    render(<Header game={game} />);

    const btn = screen.getByRole("button", { name: "header.btn.reset" });

    fireEvent.click(btn);

    expect(game.reset).toHaveBeenCalled();
  });

  it("resetScore", () => {
    const game = new Game();
    game.resetScore = jest.fn();

    render(<Header game={game} />);

    const btn = screen.getByRole("button", { name: "header.btn.resetScore" });

    fireEvent.click(btn);

    expect(game.resetScore).toHaveBeenCalled();
  });
});
