import * as React from "react";
import * as styles from "./weathercanvas.module.scss";
import useWeather from "@hooks/useWeather";

export default function WeatherCanvas() {
  const w = useWeather();

  console.log(w);

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas}></canvas>
    </div>
  );
}
