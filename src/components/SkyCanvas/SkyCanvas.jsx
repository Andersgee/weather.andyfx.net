import * as React from "react";
import { useRef, useEffect } from "react";
import Skyweather from "@js/skyweather-gl";

export default function SkyCanvas({ weather, glsl, textures }) {
  const canvasref = useRef();
  console.log("weather: ", weather);

  useEffect(() => {
    const canvas = canvasref.current;
    const sky = new Skyweather(canvas, glsl, textures);

    /*
    const newdata = interpolatedata(wd);
    setWeatherdata(wd);

    const utc = Math.round(wd.dt[0] + wd.meta.timezone);
    const newdatevec = owm.utc2datevec(utc);

    setDatevec(newdatevec);
    setData(interpolatedata(wd));
    sky.setuniforms(newdata, newdatevec, wd);
    */
    const weatherdata = weather.list[13];
    sky.setuniforms(weatherdata, weather.city);
  }, [weather, glsl, textures]);
  return (
    <div>
      canvas below here
      <canvas ref={canvasref} />
    </div>
  );
}
