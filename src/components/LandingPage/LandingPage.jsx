import * as React from "react";
import * as styles from "./landingpage.module.scss";
//import WeatherCanvas from "@components/WeatherCanvas";
import Nav from "@src/components/Nav";
import Footer from "@components/Footer";

export default function LandingPage() {
  return (
    <div className={styles.landingpage}>
      {/*<WeatherCanvas />*/}
      <div>hero</div>
      <Nav />
      <Footer />
    </div>
  );
}
