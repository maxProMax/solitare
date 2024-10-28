import { FC, useEffect, useState } from "react";

// import { Mesh, Raycaster, Vector2 } from "three";
// import { useThree } from "@react-three/fiber";
// import { useDraggable } from "./Draggable";
// import { Box } from "./Box";

export const Table: FC = () => {
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () => {
      setSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // const { position, onPointerDown, onPointerUp, onPointerMove, boxRef } =
  //   useDraggable({
  //     initPosition: [0, 0, 10.5],
  //     horizontalLimit: TABLE_WIDTH / 2,
  //     verticalLimit: TABLE_HEIGHT / 2,
  //   });

  return (
    <>
      {/* <mesh
        ref={boxRef}
        position={position}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        // ref={boxRef}
        // position={position}
        // onPointerDown={() => {
        //   toggleDragging(true);
        // }}
        // onPointerUp={() => {
        //   toggleDragging(false);

        //   setPosition(([x, y]) => [x, y, Z_POSITION]);
        // }}
        // onPointerMove={(e) => {
        //   if (!isDragging) {
        //     return;
        //   }

        //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        //   mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        //   raycaster.setFromCamera(mouse, three.camera);

        //   const intersects = raycaster.intersectObjects(
        //     boxRef.current ? [boxRef.current] : [],
        //     true
        //   );

        //   if (intersects.length > 0) {
        //     const intersect = intersects[0];

        //     const [x, y, z] = intersect.point.toArray();

        //     // console.log({ x, y, z });

        //     if (
        //       Math.abs(x) <= TABLE_WIDTH / 8 &&
        //       Math.abs(y) <= TABLE_HEIGHT / 8
        //     ) {
        //       setPosition([x, y, Z_POSITION + 2.5]);
        //     } else {
        //       toggleDragging(false);
        //       setPosition(([x, y]) => [x, y, Z_POSITION]);
        //     }
        //   }
        // }}
      >
        <boxGeometry args={[20, 20, 20]} />
        <meshStandardMaterial color={"red"} />
      </mesh> */}

      <mesh
        name="ground"
        position={[0, 0, 0]}
        // rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[size.w * 2, size.h * 2, 1]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </>
  );
};
