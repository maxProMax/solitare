import { render, screen } from "@testing-library/react";
import { TableComponent } from "./Table";
import { Game } from "@/modules/game/game";

describe("Table component", () => {
  it("render", () => {
    render(<TableComponent game={new Game()} />);

    expect(screen.getByTestId("deck")).toBeInTheDocument();
    expect(screen.getAllByTestId("pile")).toHaveLength(7);
    expect(screen.getByTestId("foundation")).toBeInTheDocument();
  });
});
