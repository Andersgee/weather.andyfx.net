import * as React from "react";
import { useRef, useEffect } from "react";
import Skyweather from "@js/skyweather-gl";

export default function SkyCanvas({ glsl, textures }) {
  const canvasref = useRef();

  useEffect(() => {
    const canvas = canvasref.current;
    const sky = new Skyweather(canvas, glsl, textures);
  }, []);
  return (
    <div>
      canvas below here
      <canvas ref={canvasref} />
    </div>
  );
}
