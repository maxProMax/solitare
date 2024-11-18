"use client";

import { FC, useEffect, useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as PerspectiveCameraThree } from "three";

const breakPoints: [number, { fov: number; y: number; z: number }][] = [
  [320, { fov: 69, y: 0, z: 700 }],
  [390, { fov: 69, y: 0, z: 760 }],
  [600, { fov: 35, y: 40, z: 800 }],
  [840, { fov: 35, y: 70, z: 760 }],
  [1024, { fov: 58, y: 0, z: 760 }],
  [1440, { fov: 62, y: 0, z: 500 }],
  [1920, { fov: 68, y: 0, z: 450 }],
];
const calc = () => {
  const width = window.outerWidth;

  for (let i = 0; i < breakPoints.length; i++) {
    const current = breakPoints[i];
    const next = breakPoints[i + 1];

    if (!next) {
      return current[1];
    }

    if (current[0] <= width && width < next[0]) {
      return current[1];
    }
  }

  return breakPoints[0][1];
};

export const Camera: FC = () => {
  const cameraRef = useRef<PerspectiveCameraThree>(null);

  const [sizes, setSizes] = useState(calc());

  useEffect(() => {
    const onResize = () => {
      // ios issue
      setTimeout(() => {
        setSizes(calc());
      }, 100);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* <OrbitControls /> */}
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[0, sizes?.y, sizes?.z]}
        fov={sizes.fov}
        far={5000}
        near={0.1}
      />
    </>
  );
};
