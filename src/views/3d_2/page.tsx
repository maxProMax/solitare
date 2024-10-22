"use client";

import { FC, useRef, createRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  // PerspectiveCamera,
  CameraControls,
  Grid,
  useHelper,
  DragControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Game } from "@/modules/game/game";
import { Scene } from "@/components/3d/card/Scene";
import { CameraHelper, OrthographicCamera } from "three";
import { Camera, Camera_2 } from "./Camera";
import { Light } from "./Light";
import { Leva } from "leva";
import { Raycaster, Vector2, Mesh } from "three";
import { Meshes } from "./Meshes";

export const Container3D: FC = () => {
  const cameraRef = useRef<OrthographicCamera>(null);
  const groundRef = useRef<OrthographicCamera>(null);
  const cubeRef = useRef<OrthographicCamera>(null);
  const game = new Game();

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
