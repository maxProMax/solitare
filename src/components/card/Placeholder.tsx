import { FC, PropsWithChildren, DragEvent, CSSProperties } from "react";
import styles from "./styles.module.css";

export const Placeholder: FC<
  PropsWithChildren<{
    onDrop?: (e: DragEvent<HTMLDivElement>) => void;
    style?: CSSProperties;
  }>
> = ({ children, onDrop, style }) => {
  return (
    <div
      className={styles.placeholder}
      data-testid="card-placeholder"
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      style={style}
    >
      {children}
    </div>
  );
};
