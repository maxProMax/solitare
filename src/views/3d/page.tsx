"use client";

import { FC } from "react";
import { Canvas } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
import { Game } from "@/modules/game/game";
import { Scene } from "@/components/3d/card/Scene";
// import { CameraHelper, OrthographicCamera } from "three";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { Leva } from "leva";
import styles from "./styles.module.css";

export const Container3D: FC = () => {
  // const cameraRef = useRef<OrthographicCamera>(null);
  const game = new Game();

  // console.log( { game });

  return (
    <div
      className={styles.view}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Leva />
      <Canvas
        dpr={[1, window.devicePixelRatio]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance", // Optimizes for mobile GPU
        }}
        linear
        flat
        shadows
        camera={{ position: [0, 0, 500] }}
      >
        {/* {cameraRef.current && <cameraHelper args={[cameraRef.current]} />} */}
        <Camera />
        {/* <Grid args={[10, 10]} /> */}

        {/* <axesHelper args={[50]} /> */}

        <Light />

        <Scene game={game} />
      </Canvas>
    </div>
  );
};

export default Container3D;
