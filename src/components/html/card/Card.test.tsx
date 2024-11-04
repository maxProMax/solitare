import { CardComponent } from "./Card";
import { render, screen } from "@testing-library/react";
import { Type, Suit, Card } from "@/modules/game/card";

describe("card component", () => {
  it("render card", () => {
    const card = new Card({ suit: Suit.CLUBS, type: Type.EIGHT });
    card.openCard();

    render(<CardComponent card={card} />);

    const suitEl = screen.getAllByText(Suit.CLUBS);
    const typeEl = screen.getAllByText(Type.EIGHT);

    expect(suitEl).toHaveLength(2);
    expect(typeEl).toHaveLength(2);
  });
});
