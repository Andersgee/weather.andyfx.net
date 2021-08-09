import * as React from "react";
import { useRef, useEffect, useState } from "react";
import Skyweather from "@js/skyweather-gl";
import Description from "./Description";
import * as styles from "./skycanvas.module.scss";

import { mix } from "@js/interpolate";

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export default function SkyCanvas({ weather, glsl, textures }) {
  const canvasref = useRef();
  const [sky, setSky] = useState(null);
  //const [index, setIndex] = useState(0);
  const [minuteoffset, setMinuteoffset] = useState(0);
  const [w, setW] = useState(weather.list[0]);
  /*
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
    const w_new = { ...weather.list[i] };
    console.log("weather.date:", w_new.date);
    sky.setuniforms(w_new, weather.city);
    setW(w_new);
    setIndex(i);
  };
*/
  const handleMinuteoffset = (e) => {
    const o = e.target.value; //how many minutes past datapoint 0

    const i = Math.floor(o / 180); // I have data in 3h increments aka 180 minute increments
    const m = o % 180; // how many minutes past datapoint i
    const t = m / 180; //how far past current datapoint. i=0 with t=0.6 means 60% toward i=1
    const w_new = { ...weather.list[i] };

    //these 3 needs to be interpolated: cloudiness, rain, date
    w_new.cloudiness = mix(
      weather.list[i].cloudiness,
      weather.list[i + 1].cloudiness,
      t
    );
    w_new.rain = mix(weather.list[i].rain, weather.list[i + 1].rain, t);
    w_new.date = addMinutes(weather.list[i].date, m);

    sky.setuniforms(w_new, weather.city);
    setW(w_new);
    setMinuteoffset(o);
  };

  useEffect(() => {
    console.log("instantiating new Skyweather");
    const canvas = canvasref.current;
    const sky = new Skyweather(canvas, glsl, textures);
    setSky(sky);
    sky.setuniforms(weather.list[0], weather.city);
  }, [weather, glsl, textures]);

  return (
    <div className={styles.skycanvas}>
      {/*
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
      <div>minutes</div>
      */}
      <Description w={w} />
      <input
        type="range"
        step={1}
        min={0}
        max={7019} //5 days minutes 3 hours
        value={minuteoffset}
        onChange={handleMinuteoffset}
      />

      <canvas ref={canvasref} className={styles.canvas} />
    </div>
  );
}
