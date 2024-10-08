import { FC } from "react";
import { PileComponent } from "./Pile";
import { PileWithTransfer } from "@/modules/game/pile";
import styles from "./styles.module.css";

export const Piles: FC<{ piles?: PileWithTransfer[] }> = ({ piles = [] }) => {
  return (
    <div className={styles.pilesWrapper}>
      <div className={styles.piles}>
        {piles.map((pile, i) => (
          <PileComponent key={i} pile={pile} />
        ))}
      </div>
    </div>
  );
};
