import { FC } from "react";
import { Environment } from "@react-three/drei";
import bg from "./bg.jpg";

export const Light: FC = () => {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight
        color={"yellow"}
        intensity={400}
        decay={1}
        position={[100, 0, 300]}
        castShadow={true}
      />
      <pointLight
        color={"yellow"}
        intensity={400}
        decay={1}
        position={[-200, 0, 300]}
        castShadow={true}
      />
      <Environment frames={1} resolution={1} files={bg.src} />
    </>
  );
};
