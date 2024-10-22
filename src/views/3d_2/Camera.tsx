"use client";

import { FC, useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  useHelper,
  PerspectiveCamera,
  OrthographicCamera,
} from "@react-three/drei";
import {
  CameraHelper,
  PerspectiveCamera as PerspectiveCameraThree,
} from "three";
import { useControls, folder } from "leva";

export const Camera: FC = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const cameraRef = useRef<PerspectiveCameraThree>(null);

  useHelper(cameraRef, CameraHelper);

  return (
    <>
      <PerspectiveCamera
        // makeDefault={true}
        ref={cameraRef}
        // args={[35, width / height, 0.05, 10]}
        position={[0, 0, 7]}

        // args={[
        //   cameraCtl.f?.fov,
        //   cameraCtl.f?.aspect,
        //   cameraCtl.f?.near,
        //   cameraCtl.f?.far,
        // ]}
      />
      {/* <OrthographicCamera
        // args={[35, width / height, 0.05, 10]}
        args={[-width / 2, width / 2, -height / 2, height / 2, 0.01, 11]}
        // args={[-100, 100, 100, -100, 0.1, 1000]}
        makeDefault={true}
        ref={cameraRef}
        zoom={300}
        // rotation={[0, 0, Math.PI]}
        position={[0, 0, 10]}
      /> */}
      {/* <cameraHelper args={[camera]} /> */}
      {/* <OrthographicCamera makeDefault ref={cameraRef} position={[0, 0, 0.01]} /> */}
    </>
  );
};

export const Camera_2: FC = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const cameraRef = useRef<PerspectiveCameraThree>(null);

  useHelper(cameraRef, CameraHelper);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 10, 20]}
        rotation={[-Math.PI / 8, 0, 0]}
      />
    </>
  );
};
