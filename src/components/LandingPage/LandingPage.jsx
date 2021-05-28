import * as React from "react";
import * as styles from "./landingpage.module.scss";
import Hero from "@src/components/Hero";
import Main from "@src/components/Main";
import Footer from "@components/Footer";

export default function LandingPage() {
  return (
    <div className={styles.landingpage}>
      <Hero />
      <Main />
      <Footer />
    </div>
  );
}
