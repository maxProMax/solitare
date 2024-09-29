import "@testing-library/jest-dom";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    function t(tk: string) {
      return tk;
    }

    t.raw = (tk: string) => tk;
    t.rich = (tk: string) => tk;

    return t;
  },
}));
