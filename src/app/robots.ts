import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const _h = await headers();

  return {
    rules: {
      userAgent: "*",
      disallow: "",
      allow: "/",
    },
    sitemap: `https://${_h.get("host")}/sitemap.xml`,
  };
}
