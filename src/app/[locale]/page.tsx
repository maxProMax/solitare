import dynamic from "next/dynamic";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LOCALES } from "@/locales";
import { Loader } from "@/components/3d/loader/loader";

const View3d = dynamic(() => import("@/views/3d/view"), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: `${process.env.HOSTNAME}/solitaire.png`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
      images: `${process.env.HOSTNAME}/solitaire.png`,
    },
    alternates: {
      canonical: process.env.HOSTNAME,
      languages: LOCALES.reduce(
        (m, l) => ({ ...m, [l]: `${process.env.HOSTNAME}/${l}` }),
        {}
      ),
    },
    icons: {
      icon: "/favicon.webp",
      shortcut: "/favicon.webp",
      apple: "/favicon.webp",
      other: {
        rel: "/favicon.webp",
        url: "/favicon.webp",
      },
    },
  };
}

export default async function Page3D() {
  return (
    <main>
      <Loader />
      <View3d />
    </main>
  );
}
