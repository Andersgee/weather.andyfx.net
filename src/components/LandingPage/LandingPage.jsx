import * as React from "react";
import * as styles from "./landingpage.module.scss";
import Main from "@src/components/Main";
import Footer from "@components/Footer";

export default function LandingPage() {
  return (
    <div className={styles.landingpage}>
      <div>hero</div>
      <Main />
      <Footer />
    </div>
  );
}
