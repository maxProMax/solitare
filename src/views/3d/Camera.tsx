"use client";

import { FC, useRef } from "react";
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
} from "three";
// import { useControls, folder } from "leva";

export const Camera: FC = () => {
  // const width = window.innerWidth / 2;
  // const height = window.innerHeight;

  const cameraRef = useRef<PerspectiveCameraThree>(null);

  // useHelper(cameraRef, CameraHelper);

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

  // const pCameraCtl = useControls("PerspectiveCamera Light", {
  //   fov: 50,
  //   aspect: 1,
  //   near: 400,
  //   far: 500,
  //   position: { x: 0, y: 0, z: 500 },
  //   makeDefault: true,
  // });

  // fov,  aspect,  near,  far, number |
  return (
    <>
      {/* <OrbitControls /> */}
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        // args={[35, width / height, 0.05, 10]}
        position={[0, 0, 500]}
        // args={Object.values(pick(pCameraCtl, ["fov", "aspect", "far", "near"]))}
        // makeDefault={pCameraCtl.makeDefault}
        // fov={pCameraCtl.fov}
        // aspect={pCameraCtl.aspect}
        // far={pCameraCtl.far}
        // near={pCameraCtl.near}
        // position={Object.values(pCameraCtl.position)}
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
