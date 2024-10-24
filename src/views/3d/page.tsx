"use client";

import { FC } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { Game } from "@/modules/game/game";
import { Scene } from "@/components/3d/card/Scene";
// import { CameraHelper, OrthographicCamera } from "three";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { Leva } from "leva";

export const Container3D: FC = () => {
  // const cameraRef = useRef<OrthographicCamera>(null);
  const game = new Game();
  // console.log( { game });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Leva />
      <Canvas shadows camera={{ position: [0, 0, 500] }}>
        {/* {cameraRef.current && <cameraHelper args={[cameraRef.current]} />} */}
        <Camera />
        <Grid args={[10, 10]} />

        <axesHelper args={[50]} />

        <Light />
        <Scene game={game} />
      </Canvas>
    </div>
  );
};

export default Container3D;
