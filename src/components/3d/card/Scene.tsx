import { FC, Fragment } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { Suit, Type } from "@/modules/game/card";
import { Object3D } from "three";
import { observer } from "mobx-react-lite";
// import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
// import { useControls } from "leva";
import { Game } from "@/modules/game/game";
import { Table } from "../table/Table";
import { Card } from "./Card";
import { Placeholder } from "./Placeholder";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const { nodes } = useGLTF("../assets/glp/cards/scene.gltf");

  const cardsMap = createMap(nodes);

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
    <group key={i} position={[0 + i * 70 - 210, 100, 1]}>
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
    <group key={i} position={[i * 70, 230, 1]}>
      <Placeholder
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
            position={[0, 0, j * 1]}
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
    </group>
  ));

  return (
    <>
      <Html position={[-400, 100, 0]}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            color: "white",
            flexDirection: "column",
          }}
        >
          <button style={{ whiteSpace: "nowrap" }} onClick={() => game.reset()}>
            {t("header.btn.reset")}
          </button>
          <button
            style={{ whiteSpace: "nowrap" }}
            onClick={() => game.resetScore()}
          >
            {t("header.btn.resetScore")}
          </button>
          <span>{game.gameState.score.total}</span>
        </div>
      </Html>
      <group name="root">
        <group>
          <group position={[-210, 230, 0]}>{stockCards}</group>
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
