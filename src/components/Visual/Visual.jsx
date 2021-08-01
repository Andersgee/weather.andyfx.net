import * as React from "react";
import * as styles from "./visual.module.scss";
import SkyCanvas from "@components/SkyCanvas";

export default function Visual({ weather, glsl, textures }) {
  const isLoaded = weather && glsl && textures;

  return (
    <div className={styles.visual}>
      {isLoaded && (
        <SkyCanvas weather={weather} glsl={glsl} textures={textures} />
      )}
    </div>
  );
}
