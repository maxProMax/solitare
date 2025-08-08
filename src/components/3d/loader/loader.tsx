"use client";
import { FC } from "react";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";

export const Loader: FC = () => {
  const t = useTranslations();

  return (
    <div className={styles.loaderBlock}>
      <div className={styles.content}>
        <h1>{t("meta.title")}</h1>
        <p>{t("meta.description")}</p>
      </div>
      <div className={styles.loading}>{t("content.loading")}...</div>
    </div>
  );
};
