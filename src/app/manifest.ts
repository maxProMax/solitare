import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Play Solitaire",
    short_name: "Play Solitaire",
    description:
      "Play classic Solitaire online for free! Enjoy this timeless card game with an easy-to-use interface and beautiful design.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.webp",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
