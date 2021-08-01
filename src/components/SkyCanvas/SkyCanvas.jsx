import * as React from "react";

export default function SkyCanvas() {
  const canvasref = React.useRef();
  return (
    <div>
      canvas below here
      <canvas ref={canvasref} />
    </div>
  );
}
