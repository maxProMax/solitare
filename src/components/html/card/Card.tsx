import { FC, CSSProperties, DragEvent, MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import { Card, Suit } from "@/modules/game/card";
import styles from "./styles.module.css";
import clsx from "clsx";

export const CardComponent: FC<{
  card: Card;
  style?: CSSProperties;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>) => void;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
}> = observer(({ card, style, onDragStart, onDrop, onClick }) => {
  const { suit, type } = card;

  return (
    <div
      data-testid="game-card"
      onClick={onClick}
      className={clsx(
        styles.card,
        [Suit.HEARTS, Suit.DIAMONDS].includes(suit) && styles.red
      )}
      style={style}
      draggable={card.isOpen}
      onDragStart={onDragStart}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e);
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        onDrop?.(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {card.isOpen ? (
        <>
          <div className={styles.topLeft}>
            <span data-testid="type">{type}</span>
            <span data-testid="suit">{suit}</span>
          </div>
          <div className={styles.bottomRight}>
            <span data-testid="type">{type}</span>
            <span data-testid="suit">{suit}</span>
          </div>
        </>
      ) : (
        <div className={styles.back}></div>
      )}
    </div>
  );
});
