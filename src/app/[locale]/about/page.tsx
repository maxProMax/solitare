import { getTranslations } from "next-intl/server";
import styles from "./styles.module.css";
import { Link } from "@/i18n/routing";

export default async function AboutPage() {
  const t = await getTranslations();

  return (
    <div className={styles.page}>
      <Link href={"/"} className={styles["button-54"]}>
        game
      </Link>
      {t.rich("page.about.desc", {
        h4: (c) => <h4 className={styles.head}>{c}</h4>,
        p: (c) => <p className={styles.paragraph}>{c}</p>,
      })}
    </div>
  );
}
