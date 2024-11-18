import { Html } from "@react-three/drei";
import { FC, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";
import clsx from "clsx";

export const Actions: FC<{
  reset: () => void;
  resetScore: () => void;
  prevStep: () => void;
  total: number;
}> = ({ reset, resetScore, prevStep, total }) => {
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
    >
      <div className={styles.btns}>
        <div className={styles["btns-row"]}>
          <button className={styles["button-54"]} onClick={prevStep}>
            <span
              style={{ display: "inline-flex", transform: "rotate(180deg)" }}
            >
              &#10140;
            </span>
          </button>
          <button className={styles["button-54"]} onClick={reset}>
            {t("header.btn.reset")}
          </button>
        </div>
        <span className={styles.textBlock}>
          {t("header.score", { score: total })}
        </span>
        <button
          className={clsx(styles["button-54"], styles.resetFullGame)}
          onClick={resetScore}
        >
          {t("header.btn.resetScore")}
        </button>
      </div>
    </Html>
  );
};
