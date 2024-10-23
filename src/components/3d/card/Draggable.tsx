import { useThree, ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Raycaster, Vector2, Object3D, Vector3, Clock } from "three";
import { useStore } from "./hooks";
import * as easing from "maath/easing";

export const useDraggable = ({
  horizontalLimit,
  verticalLimit,
}: {
  horizontalLimit: number;
  verticalLimit: number;
}) => {
  const three = useThree();
  const { objects } = useStore();
  const boxRef = useRef<Object3D>(null);
  const raycaster = new Raycaster();

  const PLUS_Z = 20;

  let isDragging_2 = false;

  let startPosition: [number, number, number] | undefined;
  let zPosition: number = 0;
  const worldPosition = new Vector3();
  const mouseShift = new Vector3();

  let animate: undefined | ((delta: number) => void);

  useFrame((s, delta) => {
    animate?.(delta);
  });

  return {
    boxRef,
    reset() {
      if (startPosition) {
        // console.log("reset");

        // a(boxRef.current?.position)(startPosition);

        if (boxRef.current?.position) {
          // console.log("run", boxRef.current?.position.toArray(), startPosition);
          // easing.damp3(boxRef.current?.position, new Vector3(0, 0, 0), 1);
          // easing.damp3(v, new Vector3(0, 9, 0), 1 / 128);
          // console.log(v);

          animate = (delta) => {
            if (!boxRef.current?.position || !startPosition || isDragging_2) {
              animate = undefined;
              return;
            }

            if (
              boxRef.current?.position.equals(new Vector3(...startPosition))
            ) {
              animate = undefined;

              return;
            }

            easing.damp3(boxRef.current?.position, startPosition, 1 / 6, delta);
          };
        }

        // boxRef.current?.position.fromArray(startPosition);
        isDragging_2 = false;
      }
    },
    onPointerDown(e: ThreeEvent<PointerEvent>) {
      isDragging_2 = true;
      startPosition = boxRef.current?.position.toArray();
      zPosition = startPosition?.[2] || 0;

      boxRef.current?.position.setZ(zPosition + PLUS_Z);

      // b = a(boxRef.current?.position);

      // boxRef.current?.getWorldPosition(worldPosition);

      const mouse = new Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, three.camera);

      const [intersect] = raycaster.intersectObjects([boxRef.current], true);
      const [x, y, z] = intersect.point.toArray();

      console.log(x, y, z);

      const { x: selfX = 0, y: selfY = 0 } = boxRef.current?.position || {};

      mouseShift
        .fromArray([x + -1 * selfX, y + -1 * selfY, 0])
        .sub(worldPosition);

      // const nextPosition = new Vector3(
      //   x - worldPosition.x - mouseShift.x,
      //   y - worldPosition.y - mouseShift.y,
      //   zPosition + PLUS_Z
      // );

      // boxRef.current?.position.copy(nextPosition);

      // console.log("d", boxRef.current?.position.toArray());
      // boxRef.current?.position.setZ(zPosition + PLUS_Z);
    },

    onPointerMove(e: ThreeEvent<PointerEvent>) {
      console.log("move");

      if (isDragging_2) {
        const mouse = new Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, three.camera);

        const intersects = raycaster.intersectObjects([boxRef.current]);

        if (intersects.length > 0) {
          const intersect = intersects[0];

          const [x, y, z] = intersect.point.toArray();
          console.log(x, y, z);

          if (Math.abs(x) <= horizontalLimit && Math.abs(y) <= verticalLimit) {
            const nextPosition = new Vector3(
              x - worldPosition.x - mouseShift.x,
              y - worldPosition.y - mouseShift.y,
              boxRef.current?.position.z
            );

            console.log(nextPosition.toArray());

            boxRef.current?.position.copy(nextPosition);
          } else {
            boxRef.current?.position.fromArray([
              x - worldPosition.x,
              y - worldPosition.y,
              boxRef.current?.position.z,
            ]);
          }
          return;
        }
      }

      isDragging_2 = false;
    },
  };
};
