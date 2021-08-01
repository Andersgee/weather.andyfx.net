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

      <div className={styles.item}>
        {Rect(`${Math.round(x.waterneed * 100)}%`, "rgb(221, 107, 107)")}
        <div
          className={styles.textpadding}
          style={{ position: "absolute", right: "0" }}
        >{`${waterneed(x.waterneed)}`}</div>
      </div>

      <div className={styles.item}>
        {Rect(`${Math.round((100 * x.temp) / 30)}%`, "rgb(122, 212, 162)")}
        <div
          className={styles.textpadding}
          style={{ position: "absolute", right: "0" }}
        >{`${temp(x.temp)}`}</div>
      </div>

      <div className={styles.item}>
        {Rect(`${Math.round(100 * x.humidity)}%`, "rgb(116, 127, 223)")}
        <div
          className={styles.textpadding}
          style={{ position: "absolute", right: "0" }}
        >{`${humidity(x.humidity)}`}</div>
      </div>
      <div className={styles.item}>
        {Rect(`${Math.round(100 * x.cloudiness)}%`, "rgb(194, 194, 194)")}
        <div
          className={styles.textpadding}
          style={{ position: "absolute", right: "0" }}
        >{`${cloudiness(x.cloudiness)}`}</div>
      </div>
      <div className={styles.item}>{`${rain(x.rain)}`}</div>
      <div
        className={styles.item}
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div>{`${windspeed(x.windspeed)}`}</div>
        <div className={styles.textpadding}>
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: `rotate(${x.winddeg}deg)`,
              marginTop: "5px",
              marginLeft: "3px",
            }}
          >
            <path
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              d="M 50 10 L 50 90 M 30 65 L 50 90 L 70 65"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Rect(p, color) {
  return (
    <svg width={p} height="100%" style={{ position: "absolute", right: "0" }}>
      <rect
        width="100%"
        height="100%"
        style={{
          fill: color,
        }}
      />
    </svg>
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
      <div className={styles.item}>Wind</div>
    </div>
  );
}

export default function Table({ weather }) {
  if (!weather) {
    return null;
  }

  const H = TableHead();

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {H}
        {weather.list.map((x) => TableRow(x))}
      </div>
    </div>
  );
}
