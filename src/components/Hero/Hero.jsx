import * as React from "react";
import * as styles from "./hero.module.scss";
import Logo from "./Logo";

export default function Hero() {
  return (
    <div>
      <div className={styles.placeholderhero}>
        <Logo />
        <h1 className={styles.andyfx}>Weather</h1>
      </div>
      <div className={styles.subtitle}>How much water a tree needs,</div>
      <div className={styles.subtitle}>based on weather data.</div>
    </div>
  );
}
