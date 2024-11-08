import { Rubik_Mono_One } from "next/font/google";
import { NotFound } from "@/components/404/page";

const inter = Rubik_Mono_One({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: "400",
});

export default function NotFoundPage() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotFound />
      </body>
    </html>
  );
}
