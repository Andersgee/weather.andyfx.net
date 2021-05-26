import * as React from "react";
import * as styles from "./weathercanvas.module.scss";
import useWeather from "@hooks/useWeather";

export default function WeatherCanvas() {
  const lon = 16.33;
  const lat = 59.91;
  const w = useWeather(lon, lat);
  console.log(w);

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas}></canvas>
    </div>
  );
}
