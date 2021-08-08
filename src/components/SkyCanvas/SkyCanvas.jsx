import * as React from "react";
import { useRef, useEffect, useState } from "react";
import Skyweather from "@js/skyweather-gl";
import * as styles from "./skycanvas.module.scss";

export default function SkyCanvas({ weather, glsl, textures }) {
  const canvasref = useRef();
  const [sky, setSky] = useState(null);
  const [index, setIndex] = useState(0);
  const [w, setW] = useState(weather.list[index]);

  const handleCloudiness = (e) => {
    const w_new = { ...w, cloudiness: e.target.value };
    sky.setuniforms(w_new, weather.city);
    setW(w_new);
  };

  const handleRain = (e) => {
    const w_new = { ...w, rain: e.target.value };
    sky.setuniforms(w_new, weather.city);
    setW(w_new);
  };

  const handleIndex = (e) => {
    const i = e.target.value;
    const w_new = weather.list[i];
    console.log("weather.date:", w_new.date);
    sky.setuniforms(w_new, weather.city);
    setW(w_new);
    setIndex(i);
  };

  useEffect(() => {
    console.log("instantiating a new Skyweather");
    const canvas = canvasref.current;
    const sky = new Skyweather(canvas, glsl, textures);
    setSky(sky);
    sky.setuniforms(weather.list[0], weather.city);
  }, [weather, glsl, textures]);

  return (
    <div className={styles.skycanvas}>
      <div>cloudiness</div>
      <input
        type="range"
        step={0.01}
        min={0}
        max={1}
        value={w.cloudiness}
        onChange={handleCloudiness}
      />
      <div>rain</div>
      <input
        type="range"
        step={0.01}
        min={0}
        max={1}
        value={w.rain}
        onChange={handleRain}
      />
      <div>index</div>
      <input
        type="range"
        step={1}
        min={0}
        max={39}
        value={index}
        onChange={handleIndex}
      />
      <div>image</div>
      <canvas ref={canvasref} className={styles.canvas} />
    </div>
  );
}
