"use client";

import { useState, useEffect } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import styles from "./style.module.css";
import { useTranslations } from "next-intl";

export const CookieConsentBanner = () => {
  const t = useTranslations();

  const [state, updateState] = useState<{
    cookieVal?: boolean;
    showBanner: boolean;
  }>({ showBanner: false });

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    updateState({ cookieVal: true, showBanner: false });
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    updateState({ cookieVal: false, showBanner: false });
  };

  useEffect(() => {
    const val = localStorage.getItem("cookieConsent");
    console.log({ val });

    updateState({
      cookieVal: Boolean(val),
      showBanner: val === null,
    });
  }, []);

  return (
    <>
      {state.cookieVal && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GMT_ID as string} />
      )}
      {state.showBanner && (
        <>
          <div className={styles.cover} onClick={(e) => e.preventDefault()}>
            <div className={styles.popup}>
              <p>{t("cookies.text")}</p>
              <div>
                <button onClick={handleAccept} className={styles.acceptButton}>
                  {t("cookies.accept")}
                </button>
                <button
                  onClick={handleDecline}
                  className={styles.declineButton}
                >
                  {t("cookies.decline")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CookieConsentBanner;
