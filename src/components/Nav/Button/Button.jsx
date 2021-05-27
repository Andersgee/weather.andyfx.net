import * as React from "react";
import * as styles from "./button.module.scss";
import clsx from "clsx";

export default function Button({ active, onClick, title }) {
  return (
    <button
      className={clsx(styles.button, active && styles.active)}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
