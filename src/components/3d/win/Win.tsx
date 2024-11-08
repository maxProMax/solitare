import { FC } from "react";
import { Html } from "@react-three/drei";
import { Firework } from "./firework/Firework";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";

export const Win: FC = () => {
  const t = useTranslations();
  return (
    <Html className={styles.win} distanceFactor={300} transform>
      <Firework />
      <div className={styles["win-screen"]}>{t("content.win.text")}</div>
    </Html>
  );
};
