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
        <Placeholder
        // style={{ marginBottom: (deck?.cards.length || 0) * 2 }}
        >
          {stock?.cards.map((card, i) => (
            <CardComponent
              key={card.id}
              card={card}
              onClick={() => stock.addToWaste()}
              // style={{ top: i * 2 }}
              // onDragStart={() => stock.addToTransfer(i)}
            />
          ))}
        </Placeholder>
      </div>
      <div>
        <Placeholder>
          {stock?.waste.map((card, i) => (
            <CardComponent
              key={card.id}
              card={card}
              // style={{ top: i * 2 }}
              onDragStart={() => stock.addToTransfer()}
            />
          ))}
        </Placeholder>
      </div>
    </div>
  );
});
