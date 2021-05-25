import * as React from "react";
import { Link } from "gatsby";

export default function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>
        <Link to="/">Go home</Link>.
      </p>
    </main>
  );
}
