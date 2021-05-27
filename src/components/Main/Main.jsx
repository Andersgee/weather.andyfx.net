import * as React from "react";
import * as styles from "./main.module.scss";
import Nav from "@components/Nav";
import Table from "@components/Table";

export default function Main() {
  return (
    <div className={styles.main}>
      <Nav />
      <Table />
    </div>
  );
}
