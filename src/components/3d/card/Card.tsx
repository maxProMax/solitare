import { FC, PropsWithChildren, RefObject } from "react";
import { Group, Mesh, Object3D, Vector3 } from "three";
import { observer } from "mobx-react-lite";
import { useDraggable } from "./Draggable";
import { ThreeEvent } from "@react-three/fiber";
import { X_SCALE } from "@/constants";

export const Card: FC<
  PropsWithChildren<{
    object3D: Object3D;
    open?: boolean;
    position: [number, number, number];
    onClick?: () => void;
    onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerUp?: (
      backToStartPosition: () => void,
      e: ThreeEvent<PointerEvent>
    ) => void;
    onPointerMove?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerEnter?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerLeave?: (
      backToStartPosition: () => void,
      e: ThreeEvent<PointerEvent>
    ) => void;
  }>
> = observer(
  ({
    position,
    object3D,
    open,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
  }) => {
    const draggable = useDraggable({
      horizontalLimit: window.innerWidth,
      verticalLimit: window.innerHeight,
    });

    return (
      <group
        ref={draggable.boxRef as RefObject<Group>}
        name={object3D.name}
        position={new Vector3(...position)}
        onClick={(e) => {
          onClick?.();

          e.stopPropagation();
        }}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();

          if (open) {
            window.document.body.classList.add("cursor-grabbing");

            if (e.target) {
              (e.target as Element).setPointerCapture(e.pointerId);
            }

            draggable.onPointerDown(e);
            onPointerDown?.(e);
          }
        }}
        onPointerUp={(e) => {
          if (open) {
            onPointerUp?.(draggable.reset, e);
            window.document.body.classList.remove(
              "cursor-grab",
              "cursor-grabbing"
            );

            if (e.target) {
              (e.target as Element).releasePointerCapture(e.pointerId);
            }
          }
        }}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          // e.stopPropagation();
          if (open) {
            window.document.body.classList.add("cursor-grab");

            draggable.onPointerMove(e);
            onPointerMove?.(e);
          }
        }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={(e) => {
          // e.stopPropagation();
          onPointerLeave?.(draggable.reset, e);
          window.document.body.classList.remove(
            "cursor-grab",
            "cursor-grabbing"
          );

          if (e.target) {
            (e.target as Element).releasePointerCapture(e.pointerId);
          }
        }}
      >
        <group
          scale={[X_SCALE, 1, 1]}
          rotation={[0, open ? 0 : Math.PI, 0]}
          position={[0, 0, 0.5]}
        >
          {(object3D.children as Mesh[]).map((child) => (
            <mesh
              key={child.name}
              name={child.name}
              castShadow
              receiveShadow
              geometry={child.geometry}
              material={child.material}
            />
          ))}
        </group>
        {children}
      </group>
    );
  }
);
