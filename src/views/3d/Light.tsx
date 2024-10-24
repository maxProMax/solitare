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
      <ambientLight intensity={0.9} />
      {/* <directionalLight castShadow position={[0, 0, 2]} /> */}
      <pointLight
        // ref={point}
        color={"white"}
        intensity={200}
        decay={1}
        // position={[
        //   pointCtl.position.x,
        //   pointCtl.position.y,
        //   pointCtl.position.z,
        // ]}
        position={[100, 20, 300]}
        castShadow={true}
      />
      <pointLight
        // ref={point}
        color={"white"}
        intensity={200}
        decay={1}
        // position={[
        //   pointCtl.position.x,
        //   pointCtl.position.y,
        //   pointCtl.position.z,
        // ]}
        position={[-100, 20, 300]}
        castShadow={true}
      />
      <Environment preset="lobby" />
    </>
  );
};
