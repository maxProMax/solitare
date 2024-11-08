import { FC } from "react";
import styles from "./style.module.css";

export const Firework: FC = () => {
  return (
    <div>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
    </div>
  );
};
