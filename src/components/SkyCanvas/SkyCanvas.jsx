import * as React from "react";
import { useRef, useEffect, useState } from "react";
import Skyweather from "@js/skyweather-gl";
import * as styles from "./skycanvas.module.scss";

export default function SkyCanvas({ weather, glsl, textures }) {
  const canvasref = useRef();
  const [sky, setSky] = useState(null);
  const [w, setW] = useState(weather.list[3]);
  const [cloudiness, setCloudiness] = useState(0);

  const handleCloudiness = (e) => {
    console.log("cloudiness:", e.target.value);
    setCloudiness(e.target.value);
    w.cloudiness = e.target.value;
    sky.setuniforms(w, weather.city);
    console.log("w.cloudiness", w.cloudiness);
  };

  useEffect(() => {
    console.log("instantiating a new Skyweather");
    const canvas = canvasref.current;
    const sky = new Skyweather(canvas, glsl, textures);
    setSky(sky);
    sky.setuniforms(w, weather.city);
  }, [weather, glsl, textures]);

  return (
    <div className={styles.skycanvas}>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={cloudiness}
        onChange={handleCloudiness}
      />
      <div>canvas below here</div>
      <canvas ref={canvasref} className={styles.canvas} />
    </div>
  );
}
