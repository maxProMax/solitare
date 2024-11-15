"use client";

import { useState, useEffect } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import styles from "./style.module.css";
import { useTranslations } from "next-intl";

function gtag(...args: unknown[]) {
  window.dataLayer?.push(args);
}
function allConsentGranted() {
  gtag("consent", "update", {
    ad_user_data: "granted",
    ad_personalization: "granted",
    ad_storage: "granted",
    analytics_storage: "granted",
  });
}

export const CookieConsentBanner = () => {
  const t = useTranslations();

  const [state, updateState] = useState<{
    cookieVal?: boolean;
    showBanner: boolean;
  }>({ showBanner: false });

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    allConsentGranted();
    updateState({ cookieVal: true, showBanner: false });
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    updateState({ cookieVal: false, showBanner: false });
  };

  useEffect(() => {
    const intGTM = () => {
      window.dataLayer = window.dataLayer || [];
      console.log(111);

      gtag("js", new Date());
      gtag("config", process.env.NEXT_PUBLIC_GMT_ID);
    };

    const val = localStorage.getItem("cookieConsent");

    intGTM();

    const isGranted = val === "true";

    if (isGranted) {
      allConsentGranted();
    } else {
      gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }

    updateState({
      cookieVal: isGranted,
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
