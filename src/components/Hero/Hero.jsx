import * as React from "react";
import * as styles from "./hero.module.scss";
import Logo from "./Logo";

export default function Hero() {
  return (
    <div className={styles.placeholderhero}>
      <Logo />
      <h1 className={styles.andyfx}>Andyfx</h1>
    </div>
  );
}
