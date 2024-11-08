"use client";

import { FC, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Game } from "@/modules/game/game";
import { Scene } from "@/components/3d/scene/Scene";
import { Camera } from "./Camera";
import { Light } from "./Light";
import styles from "./styles.module.css";

export const View3D: FC = () => {
  const game = new Game();

  return (
    <div
      className={styles.view}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
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
        <Camera />
        <Light />
        <Suspense fallback={null}>
          <Scene game={game} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default View3D;
