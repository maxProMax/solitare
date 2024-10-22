import { useThree, ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import { Raycaster, Vector2, Object3D, Vector3 } from "three";
import { useStore } from "./hooks";

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

  let isDragging_2 = false;

  let startPosition: [number, number, number] | undefined;
  let zPosition: number = 0;
  const worldPosition = new Vector3();
  const mouseShift = new Vector3();

  return {
    boxRef,
    reset() {
      if (startPosition) {
        console.log("reset");

        boxRef.current?.position.fromArray(startPosition);
        isDragging_2 = false;
      }
    },
    onPointerDown(e: ThreeEvent<PointerEvent>) {
      isDragging_2 = true;
      startPosition = boxRef.current?.position.toArray();
      zPosition = startPosition?.[2] || 0;

      boxRef.current?.getWorldPosition(worldPosition);

      const mouse = new Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, three.camera);

      const [intersect] = raycaster.intersectObjects([...objects], true);
      const [x, y] = intersect.point.toArray();

      const { x: selfX = 0, y: selfY = 0 } = boxRef.current?.position || {};
      mouseShift
        .fromArray([x + -1 * selfX, y + -1 * selfY, 0])
        .sub(worldPosition);
    },

    onPointerMove(e: ThreeEvent<PointerEvent>) {
      if (isDragging_2) {
        const mouse = new Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, three.camera);

        const intersects = raycaster.intersectObjects([...objects], true);

        if (intersects.length > 0) {
          const intersect = intersects[0];

          const [x, y] = intersect.point.toArray();

          if (Math.abs(x) <= horizontalLimit && Math.abs(y) <= verticalLimit) {
            const nextPosition = new Vector3(
              x - worldPosition.x - mouseShift.x,
              y - worldPosition.y - mouseShift.y,
              zPosition + 20
            );
            console.log(boxRef.current?.position.toArray());
            console.log(nextPosition.toArray());

            boxRef.current?.position.copy(nextPosition);
          } else {
            boxRef.current?.position.fromArray([
              x - worldPosition.x,
              y - worldPosition.y,
              zPosition,
            ]);
          }
          return;
        }
      }

      isDragging_2 = false;
    },
  };
};
