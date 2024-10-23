import { ThreeEvent } from "@react-three/fiber";
import { FC } from "react";

export const Placeholder: FC<{
  position?: [number, number, number];
  onPointerEnter?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerLeave?: (e: ThreeEvent<PointerEvent>) => void;
}> = ({ position = [0, 0, 0], onPointerEnter, onPointerLeave }) => {
  return (
    <mesh
      position={position}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <boxGeometry args={[50, 100, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
