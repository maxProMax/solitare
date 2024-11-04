import { fireEvent, render, screen } from "@testing-library/react";
import { Win } from "./Win";

describe("Win", () => {
  test("init", () => {
    render(<Win />);

    expect(screen.getByText("content.win.text")).toBeInTheDocument();
  });

  test("reset", () => {
    const reset = jest.fn();

    render(<Win reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "header.btn.reset" }));

    expect(reset).toHaveBeenCalled();
  });
});
