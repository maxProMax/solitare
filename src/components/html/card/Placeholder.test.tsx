import { render, screen } from "@testing-library/react";
import { Placeholder } from "./Placeholder";

describe("Placeholder", () => {
  it("init render", () => {
    const TEXT = "text";
    render(
      <Placeholder>
        <span>{TEXT}</span>
      </Placeholder>
    );

    expect(screen.getByTestId("card-placeholder")).toBeInTheDocument();
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });
});
