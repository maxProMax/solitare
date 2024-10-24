import { FC, useRef } from "react";
import { Environment } from "@react-three/drei";
import { useControls } from "leva";

export const Light: FC = () => {
  const pointCtl = useControls("Point Light", {
    position: {
      x: 0,
      y: 0,
      z: 3,
    },
    castShadow: true,
    intensity: 20,
  });
  const point = useRef(null);

  // useHelper(point, PointLightHelper);

  return (
    <>
      <ambientLight intensity={0.9} />
      {/* <directionalLight castShadow position={[0, 0, 2]} /> */}
      <pointLight
        ref={point}
        color={"white"}
        intensity={pointCtl.intensity}
        position={[
          pointCtl.position.x,
          pointCtl.position.y,
          pointCtl.position.z,
        ]}
        castShadow={pointCtl.castShadow}
      />
      <Environment preset="lobby" />
    </>
  );
};
