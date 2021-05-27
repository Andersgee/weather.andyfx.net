import * as React from "react";
import * as styles from "./nav.module.scss";
import clsx from "clsx";

export default function Nav() {
  const [active, setActive] = React.useState(0);

  return (
    <div className={styles.nav}>
      <button
        onClick={() => setActive(0)}
        className={clsx(styles.navbutton, active === 0 && styles.active)}
      >
        Table
      </button>
      <button
        onClick={() => setActive(1)}
        className={clsx(styles.navbutton, active === 1 && styles.active)}
      >
        Visual
      </button>
    </div>
  );
}
