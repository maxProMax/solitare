"use client";

import { FC, useEffect, useRef, useState } from "react";
// import { useThree } from "@react-three/fiber";
// import { pick } from "lodash";
import {
  useHelper,
  PerspectiveCamera,
  // OrthographicCamera,
  // OrbitControls,
} from "@react-three/drei";
import {
  CameraHelper,
  PerspectiveCamera as PerspectiveCameraThree,
  // Vector3,
} from "three";
import { useControls } from "leva";

export const Camera: FC = () => {
  // const width = window.innerWidth / 2;
  // const height = window.innerHeight;

  const cameraRef = useRef<PerspectiveCameraThree>(null);

  useHelper(cameraRef, CameraHelper);

  // const pointCtl = useControls("OrthographicCamera Light", {
  //   left: width / -2,
  //   right: width / 2,
  //   top: height / 2,
  //   bottom: height / -2,
  //   near: 0.1,
  //   far: 100,
  //   position: { x: 0, y: 0, z: 100 },
  //   makeDefault: true,
  // });

  // const getCameraZ = () => -1.99 * window.innerWidth + 3055;
  const getCameraZ = () => -0.1173 * window.innerWidth + 1210;
  const getCameraFov = () => 0.091 * window.innerWidth - 13.12;

  const breakPoints: [number, { fov: number; z: number }][] = [
    [390, { fov: 75, z: 600 }],
    [800, { fov: 55, z: 600 }],
    [1440, { fov: 55, z: 500 }],
    [1920, { fov: 60, z: 450 }],
  ];
  const calc = () => {
    const width = window.innerWidth;

    for (let i = 0; i < breakPoints.length; i++) {
      const current = breakPoints[i];
      const next = breakPoints[i + 1];

      if (!next) {
        return current[1];
      }

      if (current[0] >= width && width <= next[0]) {
        return current[1];
      }
    }
    return breakPoints[0][1];
  };
  const [sizes, setSizes] = useState(calc());
  const [cameraZ, setCameraZ] = useState(getCameraZ());
  const [cameraFov, setCameraFov] = useState(getCameraFov());

  // const [pCameraCtl] = useControls(
  //   () => ({
  //     fov: sizes?.fov,
  //     aspect: 1,
  //     near: 0.1,
  //     far: 5000,
  //     position: { value: { x: 0, y: 0, z: sizes.z } },
  //     makeDefault: true,
  //   }),
  //   [sizes]
  // );

  useEffect(() => {
    const onResize = () => {
      setCameraZ(getCameraZ());
      setSizes(calc());
      // setCameraFov(getCameraFov());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // fov,  aspect,  near,  far, number |
  return (
    <>
      {/* <OrbitControls /> */}
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        // args={[35, width / height, 0.05, 10]}
        // position={[0, 0, 500]}
        // args={Object.values(pick(pCameraCtl, ["fov", "aspect", "far", "near"]))}
        // makeDefault={pCameraCtl.makeDefault}
        // fov={46}
        // aspect={pCameraCtl.aspect}
        // far={pCameraCtl.far}
        // near={pCameraCtl.near}
        // fov={pCameraCtl.fov}
        // position={Object.values(pCameraCtl.position)}
        position={[0, 0, sizes?.z]}
        fov={sizes.fov}
        far={5000}
        near={0.1}
        // zoom={4}
        // rotation={[0, 0, 0]}

        // args={[
        //   cameraCtl.f?.fov,
        //   cameraCtl.f?.aspect,
        //   cameraCtl.f?.near,
        //   cameraCtl.f?.far,
        // ]}
      />
      {/* <OrthographicCamera
        makeDefault
        ref={cameraRef}
        args={[width / -2, width / 2, height / 2, height / -2, 0.1, 1000]}
        position={[0, 0, 100]}
        zoom={1.25}
        // left={pointCtl.left}
        // right={pointCtl.right}
        // top={pointCtl.top}
        // bottom={pointCtl.bottom}
        // near={pointCtl.near}
        // far={pointCtl.far}
        // position={Object.values(pointCtl.position)}
        // position={[0, 0, 1]}
        // position={[0, 0, 10]}
      /> */}
      {/* <cameraHelper args={[camera]} /> */}
      {/* <OrthographicCamera makeDefault ref={cameraRef} position={[0, 0, 0.01]} /> */}
    </>
  );
};
