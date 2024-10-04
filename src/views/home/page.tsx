"use client";

import { FC } from "react";
import { TableComponent } from "@/components/table/Table";
import { Game } from "@/modules/game/game";
import { Header } from "@/components/header/Header";
import styles from "./styles.module.css";

export const HomeContainer: FC = () => {
  const game = new Game();
  console.log({ game });

  return (
    <div className={styles.page}>
      <Header game={game} />
      <TableComponent game={game} />
    </div>
  );
};

export default HomeContainer;
