import * as React from "react";
import * as styles from "./landingpage.module.scss";
import WeatherCanvas from "@components/WeatherCanvas";

export default function LandingPage() {
  return (
    <div className={styles.landingpage}>
      <WeatherCanvas />
    </div>
  );
}
