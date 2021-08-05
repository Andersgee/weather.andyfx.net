import * as React from "react";
import { useRef, useEffect } from "react";
import Skyweather from "@js/skyweather-gl";

export default function SkyCanvas({ weather, glsl, textures }) {
  const canvasref = useRef();

  useEffect(() => {
    if (weather && glsl && textures) {
      console.log("instantiating a new Skyweather");
      const canvas = canvasref.current;
      const sky = new Skyweather(canvas, glsl, textures);
      const weatherdata = weather.list[3];
      sky.setuniforms(weatherdata, weather.city);
    }
  }, [weather, glsl, textures]);
  return (
    <div>
      canvas below here
      <canvas ref={canvasref} />
    </div>
  );
}
