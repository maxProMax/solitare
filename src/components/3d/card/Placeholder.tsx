import { FINAL_WIDTH } from "@/constants";
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
      <boxGeometry args={[FINAL_WIDTH, 100, 1]} />
      <meshStandardMaterial color="#1911f2" transparent opacity={0.5} />
    </mesh>
  );
};
