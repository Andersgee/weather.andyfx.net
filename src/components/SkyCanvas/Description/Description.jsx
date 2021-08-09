import * as React from "react";
import * as styles from "./description.module.scss";

function timestandardstring(date) {
  //just add leading zero eg "01:02" instead of "1:2"
  const h = date.getHours();
  const m = date.getMinutes();
  const f = (x) => (x < 10 ? `0${x}` : `${x}`);
  return `${f(h)}:${f(m)}`;
}

function Row({ a, b }) {
  return (
    <div className={styles.row}>
      <div className={styles.col1}>{a}</div>
      <div className={styles.col2}>{b}</div>
    </div>
  );
}

export default function Description({ w }) {
  return (
    <div className={styles.textbox}>
      <div className={styles.textboxcontent}>
        <div className={styles.timestandard}>{timestandardstring(w.date)}</div>
        <div className={styles.datestring}>{w.date.toDateString()}</div>
        <Row a="clouds" b={`${Math.round(w.cloudiness * 100)}%`} />
        <Row a="rain" b={`${Math.round(w.rain * 10) / 10} mm/h`} />
      </div>
    </div>
  );
}
