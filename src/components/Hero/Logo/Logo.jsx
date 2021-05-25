import * as React from "react";
import useLogo from "@hooks/useLogo";
import { GatsbyImage } from "gatsby-plugin-image";
import * as styles from "./logo.module.scss";

export default function Logo() {
  const { andyfx } = useLogo();
  return (
    <GatsbyImage
      image={andyfx}
      alt="andyfx"
      className={styles.logo}
      imgStyle={{ objectFit: "contain" }}
    />
  );
}
