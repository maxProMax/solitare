import { Card, Type, TYPE_ORDER, SUIT_COLORS } from "./card";
import { Transfer } from "./transfer";
import { CardsHolder } from "./cards-holder";

export class Pile extends CardsHolder {
  static pileAmounts = [1, 2, 3, 4, 5, 6, 7];

  constructor(cards: Card[], transfer: Transfer) {
    super(transfer);

    cards.forEach((card) => {
      this.addToCards(card);
    });

    this.openLastCard();
  }

  addCardsFromTransfer() {
    const [firstCard] = this.transfer.cards;

    if (!this.checkRules(firstCard)) {
      return;
    }

    this.transfer.fromInstance?.removeTransferredCards();

    const cards = this.transfer.getCardAndRestTransfer();

    cards.forEach((card) => {
      card.openCard();
    });

    super.addToCards(...cards);
  }

  checkRules(card?: Card): boolean {
    if (!card) {
      return false;
    }

    if (!this.cards.length && card?.type === Type.KING) {
      return true;
    }

    const [lastCard] = this.cards.slice(-1) as [Card | undefined];

    if (!lastCard) {
      return false;
    }

    if (SUIT_COLORS[card.suit] === SUIT_COLORS[lastCard.suit]) {
      return false;
    }

    if (TYPE_ORDER[lastCard.type] - TYPE_ORDER[card.type] === 1) {
      return true;
    }

    return false;
  }
}
