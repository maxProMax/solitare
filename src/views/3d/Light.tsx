import {
  FC,
  // useRef
} from "react";
import {
  Environment,
  //  useHelper
} from "@react-three/drei";
// import { PointLightHelper } from "three";
// import { useControls } from "leva";
import bg from "./bg.jpg";

export const Light: FC = () => {
  // const pointCtl = useControls("Point Light", {
  //   position: {
  //     x: 0,
  //     y: 2,
  //     z: 300,
  //   },
  //   intensity: 200,
  //   decay: 1,
  // });
  // const point = useRef();

  // useHelper(point, PointLightHelper);

  return (
    <>
      <ambientLight intensity={1} />
      {/* <directionalLight castShadow position={[0, 0, 2]} /> */}
      <pointLight
        // ref={point}
        color={"yellow"}
        intensity={600}
        decay={1}
        // position={[
        //   pointCtl.position.x,
        //   pointCtl.position.y,
        //   pointCtl.position.z,
        // ]}
        position={[100, 0, 300]}
        castShadow={true}
      />
      <pointLight
        // ref={point}
        color={"yellow"}
        intensity={600}
        decay={1}
        // position={[
        //   pointCtl.position.x,
        //   pointCtl.position.y,
        //   pointCtl.position.z,
        // ]}
        position={[-200, 0, 300]}
        castShadow={true}
      />
      <Environment frames={1} resolution={1} files={bg.src} />
    </>
  );
};
