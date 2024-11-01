import { useThree, ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Raycaster, Vector2, Object3D, Vector3 } from "three";
// import { useStore } from "./hooks";
import * as easing from "maath/easing";

export const useDraggable = ({
  horizontalLimit,
  verticalLimit,
}: {
  horizontalLimit: number;
  verticalLimit: number;
}) => {
  const three = useThree();
  const boxRef = useRef<Object3D>(null);
  const raycaster = new Raycaster();

  let isDragging_2 = false;

  let startPosition: Vector3 | undefined;
  // let zPosition: number = 0;
  const worldPosition = new Vector3();
  const mouseShift = new Vector3();
  const MAX_HEIGHT = 25;

  let animate: undefined | ((delta: number) => void);

  useFrame((s, delta) => {
    animate?.(delta);
  });
  const reset = () => {
    if (startPosition) {
      animate = (delta) => {
        if (!boxRef.current?.position || !startPosition || isDragging_2) {
          animate = undefined;
          return;
        }

        if (boxRef.current?.position.equals(startPosition)) {
          animate = undefined;

          return;
        }

        easing.damp3(
          boxRef.current?.position,
          startPosition.toArray(),
          1 / 8,
          delta
        );
      };

      isDragging_2 = false;
    }
  };

  return {
    boxRef,
    reset,
    onPointerDown(e: ThreeEvent<PointerEvent>) {
      if (!boxRef.current || animate) {
        return;
      }

      isDragging_2 = true;

      startPosition = boxRef.current?.position.clone();

      boxRef.current?.getWorldPosition(worldPosition);

      const mouse = new Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, three.camera);

      let [intersect] = raycaster.intersectObjects(three.scene.children, true);

      if (!intersect) {
        return;
      }

      let [x, y] = intersect.point.toArray();

      const { x: selfX = 0, y: selfY = 0 } = boxRef.current?.position || {};

      mouseShift
        .fromArray([x + -1 * selfX, y + -1 * selfY, 0])
        .sub(worldPosition);

      // update position after zoo
      boxRef.current.position.z += MAX_HEIGHT - worldPosition.z;

      boxRef.current.updateMatrixWorld();

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, three.camera);

      [intersect] = raycaster.intersectObjects(three.scene.children, true);
      [x, y] = intersect.point.toArray();

      const nextPosition = new Vector3(
        x - worldPosition.x - mouseShift.x,
        y - worldPosition.y - mouseShift.y,
        boxRef.current.position.z
      );

      boxRef.current?.position.copy(nextPosition);
    },

    onPointerMove(e: ThreeEvent<PointerEvent>) {
      if (!boxRef.current) {
        return;
      }

      if (isDragging_2) {
        const mouse = new Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, three.camera);

        const intersects = raycaster.intersectObjects(
          three.scene.children,
          true
        );

        if (intersects.length > 0) {
          const intersect = intersects[0];

          const [x, y] = intersect.point.toArray();

          if (Math.abs(x) <= horizontalLimit && Math.abs(y) <= verticalLimit) {
            const nextPosition = new Vector3(
              x - worldPosition.x - mouseShift.x,
              y - worldPosition.y - mouseShift.y,
              boxRef.current?.position.z
            );

            boxRef.current?.position.copy(nextPosition);

            return;
          } else {
            reset();
          }
        }
      }

      isDragging_2 = false;
    },
  };
};
