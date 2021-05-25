import * as React from "react";
import * as styles from "./button.module.scss";
import clsx from "clsx";

export default function Button({ variant, href }) {
  const v = variant || "a";
  return (
    <a href={href}>
      <button className={clsx(styles.button, styles[v])}>View Project</button>
    </a>
  );
}
