import * as React from "react";
import * as styles from "./card.module.scss";
//import { border } from "@styles/border.module.scss";
import clsx from "clsx";
import Button from "./Button";
import { GatsbyImage } from "gatsby-plugin-image";

export default function Card({ title, image, content, variant, href, flip }) {
  return (
    <div className={clsx(styles.card, flip && styles.flip)}>
      <GatsbyImage
        className={clsx(styles.cardimage, flip && styles.flip)}
        image={image}
        alt={title}
        imgStyle={{ objectFit: "cover" }}
      />
      <div className={clsx(styles.cardcontent, flip && styles.flip)}>
        <div>
          <h2>{title}</h2>
          <div>{content}</div>
        </div>
        <Button variant={variant} href={href} />
      </div>
    </div>
  );
}
