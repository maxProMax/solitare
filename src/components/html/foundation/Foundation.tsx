import { FC } from "react";
import { observer } from "mobx-react-lite";
import { FoundationWithTransfer } from "@/modules/game/foundation";
import { Placeholder } from "@/components/html/card/Placeholder";
import styles from "./styles.module.css";
import { CardComponent } from "../card/Card";

export const FoundationComponent: FC<{ foundation?: FoundationWithTransfer }> =
  observer(({ foundation }) => {
    return (
      <div className={styles.foundation} data-testid="foundation">
        {foundation?.columns.map((cards, j) => (
          <div
            key={j}
            data-testid="column"
            onDrop={(e) => {
              e.preventDefault();

              foundation.addCardsFromTransfer(j);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Placeholder>
              {cards.map((card, i) => (
                <CardComponent
                  onDragStart={() => {
                    foundation.addToTransfer(i, j);
                  }}
                  key={card.id}
                  card={card}
                />
              ))}
            </Placeholder>
          </div>
        ))}
      </div>
    );
  });
