"use client";

import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { useTranslations } from "next-intl";

function gtag(...args: unknown[]) {
  window.dataLayer?.push(args);
}
// function allConsentGranted() {
//   const data = {
//     ad_storage: "granted",
//     ad_user_data: "granted",
//     analytics_storage: "granted",
//     ad_personalization: "granted",
//     personalization_storage: "granted",
//     functionality_storage: "granted",
//     security_storage: "granted",
//   };
//   localStorage.setItem("consentMode", JSON.stringify(data));
//   gtag("consent", "update", data);
//   // gtag("js", new Date());
//   // gtag("config", `${process.env.NEXT_PUBLIC_GMT_ID}`);
// }

export const CookieConsentBanner = () => {
  const t = useTranslations();

  const [state, updateState] = useState<{
    showBanner: boolean;
  }>({ showBanner: false });

  const handleAccept = () => {
    const data = {
      ad_storage: "granted",
      ad_user_data: "granted",
      analytics_storage: "granted",
      ad_personalization: "granted",
      personalization_storage: "granted",
      functionality_storage: "granted",
      security_storage: "granted",
    };
    localStorage.setItem("consentMode", JSON.stringify(data));
    gtag("consent", "update", data);
    updateState({ showBanner: false });
  };

  const handleDecline = () => {
    const data = {
      ad_storage: "denied",
      ad_user_data: "denied",
      analytics_storage: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied",
      functionality_storage: "denied",
      security_storage: "denied",
    };
    localStorage.setItem("consentMode", JSON.stringify(data));
    updateState({ showBanner: false });
  };

  useEffect(() => {
    const val = localStorage.getItem("consentMode");

    // const isGranted = val === "true";

    // if (isGranted) {
    //   allConsentGranted();
    // }

    updateState({
      showBanner: val === null,
    });
  }, []);

  return (
    <>
      {/* <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GMT_ID}`}
      ></script>
      <script>{gtmScript}</script> */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() {dataLayer.push(arguments);}
          if (localStorage.getItem('consentMode') === null){
            gtag( 'consent', 'default', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'analytics_storage': 'denied',
                    'ad_personalization': 'denied',
                    'personalization_storage': 'denied',
                    'functionality_storage': 'denied',
                    'security_storage': 'denied',
            });
          } else {
            gtag('consent', 'default', JSON.parse(localStorage.getItem('consentMode')));
          }
          `,
        }}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', "${process.env.NEXT_PUBLIC_GMT_ID}");`,
        }}
      ></script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GMT_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      <script>
        {`gtag('event', 'conversion', {'send_to': 'AW-16839866483/adFCCOWp0pUaEPPw790-'});`}
      </script>
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
