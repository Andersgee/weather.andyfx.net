import * as React from "react";
import * as styles from "./footer.module.scss";
import Signature from "@components/Signature";
import useOnScreen from "@hooks/useOnScreen";
export default function Footer() {
  const signatureref = React.useRef();
  const isVisible = useOnScreen(signatureref);

  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contact}>
          <h2>Contact</h2>
          <a href="mailto:andersgee@gmail.com">andersgee@gmail.com</a>
        </div>

        <div className={styles.about}>
          <div ref={signatureref}>
            <Signature isVisible={isVisible} />
          </div>
          {/*
        <h2>About</h2>
        <a href="https://github.com/andersgee/">github</a>
        <div>item2: content2</div>
        */}
        </div>
      </div>
    </div>
  );
}
