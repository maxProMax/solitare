import { FC, PropsWithChildren, RefObject } from "react";
import { useDraggable } from "./Draggable";
import { ThreeEvent } from "@react-three/fiber";

import { Group } from "three";

export const Box: FC<PropsWithChildren<{ i: number; color?: string }>> = ({
  children,
  i,
  color = "red",
}) => {
  const draggable = useDraggable({
    horizontalLimit: window.innerWidth / 2,
    verticalLimit: window.innerHeight / 2,
  });

  return (
    <group
      ref={draggable.boxRef as RefObject<Group>}
      name={i + ""}
      position={[30 * i, 10 * i, i * 15]}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        draggable.onPointerDown(e);
      }}
      // onPointerUp={(e: ThreeEvent<PointerEvent>) => {
      //   draggable.onPointerUp(e);
      //   addPosition(i, [9, 9]);
      // }}
      // onPointerOut={(e: ThreeEvent<PointerEvent>) => {
      //   draggable.onPointerOut(e);
      // }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        draggable.onPointerMove?.(e);
      }}
    >
      <mesh name={`name-${i}`}>
        <boxGeometry args={[50, 100, 10]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {children}
    </group>
  );
};

Box.displayName = "Box";
