import { FC } from "react";
import { observer } from "mobx-react-lite";
import { StockComponent } from "@/components/stock/Stock";
import { Game } from "@/modules/game/game";
import { Piles } from "../piles/Piles";
import { FoundationComponent } from "../foundation/Foundation";
import styles from "./styles.module.css";

export const TableComponent: FC<{ game: Game }> = observer(({ game }) => {
  return (
    <div className={styles.table}>
      <div className={styles.tableInner}>
        <div className={styles.top}>
          <StockComponent stock={game.stock} />
          <FoundationComponent foundation={game.foundation} />
        </div>
        <Piles piles={game.piles} />
      </div>
    </div>
  );
});
