import * as React from "react";
import * as styles from "./weathercanvas.module.scss";
import useWeather from "@hooks/useWeather";
import { densitydifference } from "@js/stuff";

function weatherlist(data) {
  const w = data.list.map((x) => {
    const X = {
      date: new Date(x.dt_txt),
      visibility: x.visibility, //Average visibility [m]
      cloudiness: x.clouds.all / 100, //[0..100]
      pop: x.pop, //probablility of precipitation [0..1] aka likelihood of rain or snow
      rain: x.rain ? x.rain["3h"] / 3 : 0.0, // [mm/h]
      snow: x.snow ? x.snow["3h"] / 3 : 0.0, // [mm/h]

      temp: x.main.temp - 273.15, //temperature [Kelvin]
      humidity: x.main.humidity / 100, //relative humidity [0..100]
      pressure: x.main.grnd_level, //Atmospheric pressure on the ground [hPa]
      pressure_sealevel: x.main.sea_level, //Atmospheric pressure on the sea level,

      windspeed: x.wind.speed, //Wind speed. [m/s]
      winddeg: x.wind.deg, //Wind direction, [degrees] (meteorological, aka where win is coming from, with north=0 and east=90)
    };

    //derived variables

    //0 humidity at 30 C would give a value of 30 [g/m3] difference (basically max of what I could ever expect, so scale by this to get some 0..1 range)
    let waterneed = densitydifference(X.temp, X.humidity) / 30;

    X.waterneed = waterneed;

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
