import { FC } from "react";
import { observer } from "mobx-react-lite";
import { Foundation } from "@/modules/game/game";
import { Placeholder } from "@/components/card/Placeholder";
import styles from "./styles.module.css";
import { Card } from "@/modules/game/card";
import { CardComponent } from "../card/Card";

export const FoundationComponent: FC<{ foundation?: Foundation }> = observer(
  ({ foundation }) => {
    return (
      <div className={styles.foundation} data-testid="foundation">
        {foundation?.columns.map((cards, i) => (
          <div
            key={i}
            data-testid="column"
            onDrop={(e) => {
              e.preventDefault();
              // const data = e.dataTransfer.getData("text");

              // console.log({ data });

              // const { i } = JSON.parse(data);

              console.log();

              foundation.addCards(i);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            <Placeholder>
              {cards.map((card) => (
                <CardComponent key={card.id} card={card} />
              ))}
            </Placeholder>
          </div>
        ))}
      </div>
    );
  }
);
