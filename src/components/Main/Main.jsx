import * as React from "react";
import * as styles from "./main.module.scss";
import useWeather from "@hooks/useWeather";

import Nav from "@components/Nav";
import Table from "@components/Table";
import Visual from "@components/Visual";

export default function Main() {
  const [active, setActive] = React.useState("table");

  const lon = 16.33; //salbohed
  const lat = 59.91;
  const weather = useWeather(lon, lat);

  return (
    <div className={styles.main}>
      <Nav active={active} setActive={setActive} />
      {active === "table" && <Table weather={weather} />}
      {active === "visual" && <Visual />}
    </div>
  );
}
