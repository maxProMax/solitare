import { render, screen } from "@testing-library/react";
import { Foundation } from "@/modules/game/game";
import { FoundationComponent } from "./Foundation";

describe("Foundation", () => {
  it("init render", () => {
    render(<FoundationComponent foundation={new Foundation()} />);

    expect(screen.getByTestId("foundation")).toBeInTheDocument();
    expect(screen.getAllByTestId("column")).toHaveLength(4);
  });
});
