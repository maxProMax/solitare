import { FC } from "react";
import { PileComponent } from "./Pile";
import { Pile } from "@/modules/game/pile";
import styles from "./styles.module.css";

export const Piles: FC<{ piles?: Pile[] }> = ({ piles = [] }) => {
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
