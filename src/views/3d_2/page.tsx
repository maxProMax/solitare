"use client";

import { FC } from "react";
import { Canvas } from "@react-three/fiber";

import { Camera_2 } from "./Camera";
import { Light } from "./Light";
import { Leva } from "leva";
// import { Raycaster, Vector2, Mesh } from "three";
import { Meshes } from "./Meshes";

export const Container3D: FC = () => {
  // const cameraRef = useRef<OrthographicCamera>(null);
  // const groundRef = useRef<OrthographicCamera>(null);
  // const cubeRef = useRef<OrthographicCamera>(null);
  // const game = new Game();

  // console.log({ game });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Leva />
      <Canvas shadows camera={{ position: [0, 0, 0] }}>
        <Camera_2 />
        {/* <OrbitControls /> */}
        {/* {cameraRef.current && <cameraHelper args={[cameraRef.current]} />} */}
        {/* <Camera /> */}
        {/* <Grid args={[10, 10]} /> */}

        <axesHelper args={[50]} />
        {/* <OrbitControls /> */}
        <Light />
        {/* <Scene game={game} /> */}

        {/* <DragControls axisLock="y"> */}
        <Meshes />
      </Canvas>
    </div>
  );
};

export default Container3D;
