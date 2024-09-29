import { Card, Suit, Type } from "./card";
import { Stock } from "./stock";
import { Transfer } from "./transfer";

describe("Stock", () => {
  let transfer: Transfer;
  let stock: Stock;

  beforeEach(() => {
    transfer = new Transfer();
    stock = new Stock(transfer, [
      new Card(Suit.CLUBS, Type.ACE),
      new Card(Suit.DIAMONDS, Type.TEN),
    ]);
  });

  it("waste", () => {
    expect(stock.waste).toHaveLength(1);

    stock.addToWaste();

    expect(stock.waste).toHaveLength(2);
  });

  it("addToTransfer and removeTransferredCards", () => {
    stock.addToWaste();
    stock.addToTransfer();

    expect(stock.waste).toHaveLength(2);
    expect(transfer.cards).toHaveLength(1);

    stock.removeTransferredCards();

    expect(stock.waste).toHaveLength(1);
  });
});
