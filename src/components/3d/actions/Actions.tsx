import { Html } from "@react-three/drei";
import { FC, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

export const Actions: FC<{
  reset: () => void;
  resetScore: () => void;
  total: number;
}> = ({ reset, resetScore, total }) => {
  const t = useTranslations();

  const [isLandscape, setIsLandscape] = useState(
    window.innerHeight < window.innerWidth
  );
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerHeight < window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Html
      distanceFactor={300}
      transform
      position={isLandscape ? [-350, 0, 0] : [0, 350, 0]}
      //   position={Object.values(c.position)}
    >
      <div className={styles.btns}>
        <button
          className={styles["button-54"]}
          style={{ whiteSpace: "nowrap" }}
          onClick={resetScore}
        >
          {t("header.btn.resetScore")}
        </button>
        <button
          className={styles["button-54"]}
          style={{ whiteSpace: "nowrap" }}
          onClick={reset}
        >
          {t("header.btn.reset")}
        </button>
        <span className={styles.textBlock}>
          {t("header.score", { score: total })}
        </span>
      </div>
    </Html>
  );
};
