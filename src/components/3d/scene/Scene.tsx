import { FC, Fragment, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Suit, Type } from "@/modules/game/card";
import { Object3D, Vector3 } from "three";
import { observer } from "mobx-react-lite";
import { Game } from "@/modules/game/game";
import { Table } from "@/components/3d/table/Table";
import { Card, Placeholder } from "@/components/3d/card";
import { Actions } from "@/components/3d/actions/Actions";
import { useCardsWinAnimation } from "../win/hooks";
import { Win } from "../win/Win";

const suitMap = {
  [Suit.CLUBS]: "Clubs",
  [Suit.SPADES]: "Spades",
  [Suit.HEARTS]: "Hearts",
  [Suit.DIAMONDS]: "Diamonds",
};
const typeMap = {
  [Type.ACE]: "Ace",
  [Type.TWO]: "Two",
  [Type.THREE]: "Three",
  [Type.FOUR]: "Four",
  [Type.FIVE]: "Five",
  [Type.SIX]: "Six",
  [Type.SEVEN]: "Seven",
  [Type.EIGHT]: "Eight",
  [Type.NINE]: "Nine",
  [Type.TEN]: "Ten",
  [Type.JACK]: "Jack",
  [Type.QUEEN]: "Queen",
  [Type.KING]: "King",
};

const createMap = (nodes: Record<string, Object3D>) => {
  const map: Record<string, Record<string, Object3D>> = {};

  Object.keys(typeMap).forEach((type) => {
    Object.keys(suitMap).forEach((suit) => {
      Object.entries(nodes).forEach(([nodeName, node]) => {
        const key = `${typeMap[type as Type]}_of_${suitMap[suit as Suit]}`;

        if (nodeName === key) {
          if (!map[suit]) {
            map[suit] = { [type]: node };
          } else {
            map[suit][type] = node;
          }
        }
      });
    });
  });

  return map;
};

export const Scene: FC<{ game: Game }> = observer(({ game }) => {
  const { nodes } = useGLTF("../assets/glp/cards/scene.gltf");
  const cardsMap = useMemo(() => createMap(nodes), [nodes]);
  const stockPosition = new Vector3(-210, 230, 0);

  const stockCards = game.stock?.cards.map((c, i) => {
    const node = cardsMap[c.suit][c.type];

    return (
      <Card
        key={node.name}
        object3D={node}
        onClick={() => game.stock?.addToWaste()}
        position={[0, 0, i * 1 + 1]}
      />
    );
  });
  const stockWaste = game.stock?.waste.map((c, i) => {
    const node = cardsMap[c.suit][c.type];

    return (
      <Card
        object3D={node}
        key={node.name}
        open={c.isOpen}
        position={[0, 0, i * 1 + 1]}
        onPointerDown={(e) => {
          e.stopPropagation();
          game.stock?.addToTransfer();
        }}
        onPointerUp={(backToStartPosition) => {
          if (!game.helper_3d.onUpAction?.()) {
            backToStartPosition();
          }
        }}
      />
    );
  });
  const piles = game.piles?.map((pile, i) => (
    <group name="piles" key={i} position={[0 + i * 70 - 210, 100, 1]}>
      <Placeholder
        onPointerEnter={() => {
          game.helper_3d.onUpAction = () => pile.addCardsFromTransfer();
        }}
        onPointerLeave={() => {
          game.helper_3d.onUpAction = undefined;
        }}
      />
      {pile.cards.reduceRight((child, c, j) => {
        const node = cardsMap[c.suit][c.type];

        return (
          <Card
            object3D={node}
            position={[0, j === 0 ? 0 : c.isOpen ? -16 : -4, 1]}
            open={c.isOpen}
            onPointerDown={() => {
              pile.addToTransfer(j);
            }}
            onPointerUp={(backToStartPosition) => {
              if (!game.helper_3d.onUpAction?.()) {
                backToStartPosition();
              }
            }}
            onPointerEnter={() => {
              game.helper_3d.onUpAction = () => pile.addCardsFromTransfer();
            }}
            onPointerLeave={() => {
              game.helper_3d.onUpAction = undefined;
            }}
          >
            {child}
          </Card>
        );
      }, <Fragment />)}
    </group>
  ));
  const foundation = game.foundation?.columns?.map((column, i) => (
    <Fragment key={i}>
      <Placeholder
        position={[i * 70, 230, 1]}
        onPointerEnter={() => {
          game.helper_3d.onUpAction = () =>
            game.foundation?.addCardsFromTransfer(i) || false;
        }}
        onPointerLeave={() => {
          game.helper_3d.onUpAction = undefined;
        }}
      />
      {column.map((c, j) => {
        const node = cardsMap[c.suit][c.type];

        return (
          <Card
            object3D={node}
            key={node.name}
            position={[i * 70, 230, j * 1 + 1]}
            open={c.isOpen}
            onPointerDown={() => {
              game.foundation?.addToTransfer(j, i);
            }}
            onPointerUp={(backToStartPosition) => {
              if (!game.helper_3d.onUpAction?.()) {
                backToStartPosition();
              }
            }}
            onPointerEnter={() => {
              game.helper_3d.onUpAction = () =>
                game.foundation?.addCardsFromTransfer(i) || false;
            }}
            onPointerLeave={() => {
              game.helper_3d.onUpAction = undefined;
            }}
          />
        );
      })}
    </Fragment>
  ));

  const isWin = Boolean(game.foundation?.isWin);
  useCardsWinAnimation({
    finalPosition: stockPosition,
    isWin,
    reset: () => game.reset(),
  });

  return (
    <>
      <Actions
        reset={() => game.reset()}
        resetScore={() => game.resetScore()}
        total={game.gameState.score.total}
        prevStep={() => game.back()}
      />
      {isWin && <Win />}
      <group name="root">
        <group>
          <group position={stockPosition}>{stockCards}</group>
          <group position={[-120, 230, 0]}>{stockWaste}</group>
          {foundation}
          {piles}
        </group>
        <Table />
      </group>
    </>
  );
});

useGLTF.preload("../assets/glp/cards/scene.gltf");
