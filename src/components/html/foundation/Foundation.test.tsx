import { render, screen } from "@testing-library/react";
import { FoundationWithTransfer } from "@/modules/game/foundation";
import { FoundationComponent } from "./Foundation";
import { Score } from "@/modules/game/score";
import { Transfer } from "@/modules/game/transfer";

describe("Foundation", () => {
  it("init render", () => {
    const score = new Score();
    const transfer = new Transfer();
    render(
      <FoundationComponent
        foundation={new FoundationWithTransfer({ transfer, score })}
      />
    );

    expect(screen.getByTestId("foundation")).toBeInTheDocument();
    expect(screen.getAllByTestId("column")).toHaveLength(4);
  });
});
