import { FC, useRef, useState } from "react";

import { Canvas, useThree } from "@react-three/fiber";

import { Raycaster, Vector2, Mesh } from "three";

export const Meshes: FC = () => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const groundRef = useRef(null);
  const cubeRef = useRef(null);
  const cube2Ref = useRef(null);
  const three = useThree();

  console.log({ position });

  return (
    <>
      <mesh
        name="cube"
        ref={cubeRef}
        position={position}
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          e.stopPropagation();

          console.log(cubeRef.current);

          const raycaster = new Raycaster();
          const mouse = new Vector2();
          mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(mouse, three.camera);

          const intersects = raycaster.intersectObjects(
            cubeRef.current
              ? [cubeRef.current, groundRef.current, cube2Ref.current]
              : [],
            true
          );

          if (intersects.length > 0) {
            console.log(intersects);

            const intersect = intersects[0];

            const [x, y] = intersect.point.toArray();
            setPosition([x, y, 0]);
            // console.log({ x, y });

            // if (
            //   Math.abs(x) <= horizontalLimit &&
            //   Math.abs(y) <= verticalLimit
            // ) {
            //   setPosition([x, y, zPosition + 10]);
            // } else {

            // }
            return;
          }
        }}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        name="cube-2"
        ref={cube2Ref}
        position={[5, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      {/* </DragControls> */}
      <mesh name="ground" ref={groundRef} receiveShadow position={[0, -2, 0]}>
        <boxGeometry args={[5, 2, 5]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </>
  );
};
