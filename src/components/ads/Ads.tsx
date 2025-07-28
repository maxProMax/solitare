import Script from "next/script";
import styles from "./style.module.css";

export const Ads = () => {
  return (
    <div className={styles.root}>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9529954302448484"
        crossOrigin="anonymous"
      ></Script>

      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "220px", height: "100px" }}
        data-ad-client="ca-pub-9529954302448484"
        data-ad-slot="8766139588"
      ></ins>
      <Script
        id="adsbygoogle"
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      ></Script>
    </div>
  );
};
