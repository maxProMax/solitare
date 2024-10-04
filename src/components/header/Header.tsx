import { FC } from "react";
import { observer } from "mobx-react-lite";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Game } from "@/modules/game/game";

export const Header: FC<{ game: Game }> = observer(({ game }) => {
  const t = useTranslations();

  return (
    <header className={styles.header} data-testid="header">
      <button onClick={() => game.reset()}>{t("header.btn.reset")}</button>
      <button onClick={() => game.resetScore()}>
        {t("header.btn.resetScore")}
      </button>
      <span>{t("header.score", { score: game.score.total })}</span>
    </header>
  );
});
