import { Link } from "@/i18n/routing";
import { FC } from "react";
import styles from "./style.module.css";
import { useTranslations } from "next-intl";

export const Nav: FC = () => {
  const t = useTranslations();
  return (
    <nav className={styles.nav}>
      <Link className={styles.link} href={"about"}>
        {t("nav.about")}
      </Link>
    </nav>
  );
};
