import { useState, useEffect } from "react";

async function fetchweather(lon, lat) {
  const appid = "e95b492d3c977db6b58b95f097683036";
  const baseurl = "https://api.openweathermap.org/data/2.5/forecast";
  const url = `${baseurl}?lon=${lon}&lat=${lat}&appid=${appid}`;

  const forecast = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return forecast;
}

export default function useWeather(lon, lat) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchweather(lon, lat).then((w) => {
      if (w?.cod === "200") {
        setWeather(w);
      }
    });
  }, [lon, lat]);

  return weather;
}
