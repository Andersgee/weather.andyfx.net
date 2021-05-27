import * as React from "react";
import * as styles from "./main.module.scss";
import Nav from "@components/Nav";
import Table from "@components/Table";
import Visual from "@components/Visual";

export default function Main() {
  const [active, setActive] = React.useState("table");
  return (
    <div className={styles.main}>
      <Nav active={active} setActive={setActive} />
      {active === "table" && <Table />}
      {active === "visual" && <Visual />}
    </div>
  );
}
