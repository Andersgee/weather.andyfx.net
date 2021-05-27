import * as React from "react";
import * as styles from "./nav.module.scss";
import clsx from "clsx";

export default function Nav({ active, setActive }) {
  return (
    <div className={styles.nav}>
      <button
        onClick={() => setActive("table")}
        className={clsx(styles.navbutton, active === "table" && styles.active)}
      >
        Table
      </button>
      <button
        onClick={() => setActive("visual")}
        className={clsx(styles.navbutton, active === "visual" && styles.active)}
      >
        Visual
      </button>
    </div>
  );
}
