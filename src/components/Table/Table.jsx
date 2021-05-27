import * as React from "react";
import * as styles from "./table.module.scss";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

function militarytimeFromHour(h) {
  return h > 9 ? `${h}:00` : `0${h}:00`;
}

function waterneed(x) {
  return `${Math.round(x * 100)}%`;
}

function TableRow(x) {
  return (
    <div className={styles.tablerow} key={x.date}>
      <div className={styles.item}>{`${x.date.getDate()} ${
        months[x.date.getMonth()]
      }`}</div>
      <div className={styles.item}>{`${militarytimeFromHour(
        x.date.getHours()
      )}`}</div>
      <div className={styles.item}>{`${waterneed(x.waterneed)}`}</div>
    </div>
  );
}

function TableHead() {
  return (
    <div className={styles.tablerow}>
      <div className={styles.item}>Date</div>
      <div className={styles.item}>Time</div>
      <div className={styles.item}>Waterneed</div>
    </div>
  );
}

export default function Table({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <div className={styles.table}>
      {TableHead()}
      {weather.map((x) => TableRow(x))}
    </div>
  );
}
