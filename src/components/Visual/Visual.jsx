import * as React from "react";
import { useRef, useEffect } from "react";
import * as styles from "./visual.module.scss";

export default function Visual({ glsl, textures }) {
  const canvasrref = useRef();

  useEffect(() => {
    console.log(canvasrref);
    const canvas = canvasrref.current;
    console.log(canvas);
  }, []);

  return (
    <div className={styles.visual}>
      <canvas ref={canvasrref} />
    </div>
  );
}
