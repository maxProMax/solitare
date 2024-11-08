import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector3 } from "three";
import { damp3, damp } from "maath/easing";

export const useCardsWinAnimation = ({
  finalPosition,
  isWin,
  reset,
}: {
  finalPosition: Vector3;
  isWin: boolean;
  reset: () => void;
}) => {
  const three = useThree();
  let animate: undefined | ((delta: number) => void);
  useFrame((s, delta) => {
    animate?.(delta);
  });

  useEffect(() => {
    if (isWin) {
      animate = (delta) => {
        const finishPosition = new Vector3().copy(finalPosition);
        const cards = three.scene.getObjectsByProperty("name", "card");
        const [lastCard] = cards.slice(-1);

        if (lastCard.position.x === finishPosition.x) {
          animate = undefined;

          setTimeout(() => {
            reset();
          }, 2000);

          return;
        }

        cards.forEach((card, i) => {
          finishPosition.setZ(i);
          damp3(card.position, finishPosition, 1 / 4, delta);
          damp(card.rotation, "y", Math.PI, 1 / 4, delta);
        });
      };
    }
  }, [isWin]);
};
