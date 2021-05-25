import * as React from "react";
import * as styles from "./landingpage.module.scss";
import Hero from "@components/Hero";
import Cards from "@components/Cards";
import Footer from "@components/Footer";

export default function LandingPage() {
  return (
    <div className={styles.landingpage}>
      <Hero />
      <Cards />
      <Footer />
    </div>
  );
}
