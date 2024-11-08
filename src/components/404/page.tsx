import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.css";

export const NotFound: FC = () => {
  return (
    <div className={styles["page-404"]}>
      <div style={{ textAlign: "center" }}>
        <h1>404</h1>
        <Link className={styles.link} href="/">
          Go to game
        </Link>
      </div>
    </div>
  );
};
