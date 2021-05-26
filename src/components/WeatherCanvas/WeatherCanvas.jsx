import * as React from "react";
import * as styles from "./weathercanvas.module.scss";
import useWeather from "@hooks/useWeather";

function weatherlist(data) {
  const w = data.list.map((x) => {
    const X = {
      date: new Date(x.dt_txt),
      visibility: x.visibility, //Average visibility [m]
      cloudiness: x.clouds.all, //[0..100]
      pop: x.pop, //probablility of precipitation [0..1] aka likelihood of rain or snow
      rain: x.rain ? x.rain["3h"] / 3 : 0.0, // [mm/h]
      snow: x.snow ? x.snow["3h"] / 3 : 0.0, // [mm/h]

      temp: x.main.temp, //temperature [Kelvin]
      humidity: x.main.humidity, //relative humidity [0..100]
      pressure: x.main.grnd_level, //Atmospheric pressure on the ground [hPa]
      pressure_sealevel: x.main.sea_level, //Atmospheric pressure on the sea level,

      windspeed: x.wind.speed, //Wind speed. [m/s]
      winddeg: x.wind.deg, //Wind direction, [degrees] (meteorological, aka where win is coming from, with north=0 and east=90)
    };
    return X;
  });
  return w;
}

export default function WeatherCanvas() {
  const lon = 16.33;
  const lat = 59.91;
  const w = useWeather(lon, lat);
  console.log(w);

  if (w) {
    let list = weatherlist(w);
    console.log("list: ", list);
  }

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas}></canvas>
    </div>
  );
}
