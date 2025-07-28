import { DEFAULT_LOCALE, LOCALES } from "@/locales";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const _h = await headers();

  return LOCALES.flatMap((l) => [
    {
      url: `https://${_h.get("host")}${l === DEFAULT_LOCALE ? "" : `/${l}`}`,
    },
    {
      url: `https://${_h.get("host")}${
        l === DEFAULT_LOCALE ? "" : `/${l}`
      }/about`,
    },
  ]);
}
