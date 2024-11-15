import en from "./localization/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

interface Window {
  UC_UI: {
    showSecondLayer: () => void;
  };
  dataLayer: unknown[];
}
