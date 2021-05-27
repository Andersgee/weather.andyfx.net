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

function temp(x) {
  return `${Math.round(x)}°C`;
}

function humidity(x) {
  return `${Math.round(x * 100)}%`;
}

function cloudiness(x) {
  return `${Math.round(x * 100)}%`;
}

function rain(r, pop) {
  return r > 0 ? `${Math.round(r * 100) / 100} mm/h` : "";
}

function windspeed(x) {
  return `${Math.round(x)} m/s`;
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
      <div className={styles.item}>{`${temp(x.temp)}`}</div>
      <div className={styles.item}>{`${humidity(x.humidity)}`}</div>
      <div className={styles.item}>{`${cloudiness(x.cloudiness)}`}</div>
      <div className={styles.item}>{`${rain(x.rain)}`}</div>
      <div className={styles.item}>{`${windspeed(x.windspeed)}`}</div>
    </div>
  );
}

function TableHead() {
  return (
    <div className={styles.tablerow}>
      <div className={styles.item}>Date</div>
      <div className={styles.item}>Time</div>
      <div className={styles.item}>Waterneed</div>
      <div className={styles.item}>Temperature</div>
      <div className={styles.item}>Humidity</div>
      <div className={styles.item}>Cloudiness</div>
      <div className={styles.item}>Rain</div>
      <div className={styles.item}>Windspeed</div>
    </div>
  );
}

export default function Table({ weather }) {
  if (!weather) {
    return null;
  }

  const H = TableHead();

  return (
    <div className={styles.table}>
      {H}
      {weather.map((x) => TableRow(x))}
    </div>
  );
}
