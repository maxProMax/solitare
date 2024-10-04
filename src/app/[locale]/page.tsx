import { HomeContainer } from "@/views/home/page";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/views/home/page"), { ssr: false });

export default function HomePage() {
  return (
    <main>
      <Home />
    </main>
  );
}
