import * as React from "react";
import * as styles from "./visual.module.scss";
import SkyCanvas from "@components/SkyCanvas";

export default function Visual({ glsl, textures }) {
  const isLoaded = glsl && textures;

  return (
    <div className={styles.visual}>
      {isLoaded && <SkyCanvas glsl={glsl} textures={textures} />}
    </div>
  );
}
