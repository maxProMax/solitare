import { Transfer } from "./transfer";
import { PileWithTransfer } from "./pile";
import { Card, Suit, Type } from "./card";
import { GameState } from "./game";

describe("Transfer", () => {
  let transfer: Transfer;
  let pile: PileWithTransfer;
  let appState: GameState;

  beforeEach(() => {
    appState = new GameState();
    transfer = appState.transfer;
    pile = new PileWithTransfer({
      gameState: appState,
      cards: [
        new Card({ suit: Suit.HEARTS, type: Type.TEN }),
        new Card({ suit: Suit.DIAMONDS, type: Type.SEVEN }),
      ],
    });

    pile.addToTransfer(0);
  });

  it("addCards", () => {
    expect(transfer.fromInstance).toBe(pile);
    expect(transfer.cards).toHaveLength(2);
  });
  it("getCardAndRestTransfer", () => {
    const cards = transfer.getCardAndRestTransfer();

    expect(cards).toHaveLength(2);
    expect(cards[0].suit).toBe(Suit.HEARTS);
    expect(transfer.fromInstance).toBeUndefined();
  });
});
