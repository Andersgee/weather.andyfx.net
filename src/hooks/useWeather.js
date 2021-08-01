import { useState, useEffect } from "react";
import { densitydifference, dewpoint } from "@js/stuff";

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
    const waterneed = densitydifference(X.temp, X.humidity) / 30;
    const dewtemp = dewpoint(X.temp, X.humidity);

    X.waterneed = waterneed;
    X.dewtemp = dewtemp;

    return X;
  });
  return w;
}

async function fetchweather(lon, lat) {
  const appid = "e95b492d3c977db6b58b95f097683036";
  const baseurl = "https://api.openweathermap.org/data/2.5/forecast";
  const url = `${baseurl}?lon=${lon}&lat=${lat}&appid=${appid}`;

  const forecast = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });
  //console.log("forecast: ", forecast);
  return forecast;
}

export default function useWeather(lon, lat) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchweather(lon, lat).then((w) => {
      if (w?.cod === "200") {
        setWeather({ list: weatherlist(w), city: w.city });
      }
    });
  }, [lon, lat]);

  return weather;
}
