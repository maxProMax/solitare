"use client";

import { FC, useEffect, useRef, useState } from "react";
// import { useThree } from "@react-three/fiber";
// import { pick } from "lodash";
import {
  // useHelper,
  PerspectiveCamera,
  // OrthographicCamera,
  // OrbitControls,
} from "@react-three/drei";
import {
  // CameraHelper,
  PerspectiveCamera as PerspectiveCameraThree,
  // Vector3,
  // Object3D,
} from "three";
// import { useControls } from "leva";

export const Camera: FC = () => {
  const cameraRef = useRef<PerspectiveCameraThree>(null);

  // useHelper(cameraRef as MutableRefObject<Object3D>, CameraHelper);

  const breakPoints: [number, { fov: number; y: number; z: number }][] = [
    [390, { fov: 69, y: 0, z: 800 }],
    [840, { fov: 35, y: 50, z: 760 }],
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
  const [sizes, setSizes] = useState(calc());

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
        position={[0, sizes?.y, sizes?.z]}
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
