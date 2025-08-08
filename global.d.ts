import messages from "./localization/en.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    VISITED?: boolean;
  }
}
