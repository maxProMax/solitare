import { FC } from "react";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

export const Win: FC<{ reset?: () => void }> = ({ reset }) => {
  const t = useTranslations();

  return (
    <div className={styles.win}>
      <div>
        <div>{t("content.win.text")}</div>
        <button onClick={reset}>{t("header.btn.reset")}</button>
      </div>
    </div>
  );
};
