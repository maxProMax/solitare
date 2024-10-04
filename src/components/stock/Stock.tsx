import { FC } from "react";
import { observer } from "mobx-react-lite";
import { Stock } from "@/modules/game/stock";
import { CardComponent } from "@/components/card/Card";
import styles from "./styles.module.css";
import { Placeholder } from "../card/Placeholder";

export const StockComponent: FC<{ stock?: Stock }> = observer(({ stock }) => {
  return (
    <div className={styles.deck} data-testid="deck">
      <div>
        <Placeholder>
          {stock?.cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onClick={() => stock.addToWaste()}
            />
          ))}
        </Placeholder>
      </div>
      <div>
        <Placeholder>
          {stock?.waste.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onDragStart={() => stock.addToTransfer()}
            />
          ))}
        </Placeholder>
      </div>
    </div>
  );
});
