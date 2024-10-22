import { FC, PropsWithChildren, useEffect } from "react";
import { useDraggable } from "./Draggable";
import { ThreeEvent } from "@react-three/fiber";
import { useStore } from "./hooks";

export const Box: FC<PropsWithChildren<{ i: number; color?: string }>> = ({
  children,
  i,
  color = "red",
}) => {
  const { addObject, addPosition } = useStore();
  const draggable = useDraggable({
    initPosition: [30 * i, 10 * i, i * 15],
    horizontalLimit: window.innerWidth / 2,
    verticalLimit: window.innerHeight / 2,
    // zeroCoord: [30 * (i - 1), 10 * (i - 1), 0],
  });

  useEffect(() => {
    if (draggable.boxRef) {
      addObject(draggable.boxRef.current);
    }
  }, [draggable.boxRef]);

  //   console.log(x, y, i, x - 30 * (i - 1), y - 10 * (i - 1));

  return (
    <group
      ref={draggable.boxRef}
      name={i + ""}
      position={draggable.position}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        draggable.onPointerDown(e);
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        draggable.onPointerUp(e);
        addPosition(i, [9, 9]);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        draggable.onPointerOut(e);
      }}
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
