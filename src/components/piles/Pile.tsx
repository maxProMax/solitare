import { FC, DragEvent } from "react";
import { observer } from "mobx-react-lite";
import { PileWithTransfer } from "@/modules/game/pile";
import { CardComponent } from "../card/Card";
import styles from "./styles.module.css";
import { Placeholder } from "@/components/card/Placeholder";

export const PileComponent: FC<{ pile: PileWithTransfer }> = observer(
  ({ pile }) => {
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
      pile.addCardsFromTransfer();

      e.stopPropagation();
    };

    return (
      <div className={styles.pile} data-testid="pile">
        <Placeholder
          onDrop={onDrop}
          style={{ marginBottom: ((pile.cards.length || 1) - 1) * 24 }}
        >
          {pile.cards.map((card, i) => (
            <CardComponent
              key={card.id}
              card={card}
              style={{ top: i * 24 }}
              onDragStart={() => pile.addToTransfer(i)}
              onDrop={onDrop}
            />
          ))}
        </Placeholder>
      </div>
    );
  }
);
