import dynamic from "next/dynamic";

const View3d = dynamic(() => import("@/views/3d/page"), { ssr: false });

export default async function Page3D() {
  return (
    <main>
      <View3d />
    </main>
  );
}
