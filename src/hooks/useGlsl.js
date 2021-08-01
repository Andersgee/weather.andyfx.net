import { useState, useEffect } from "react";

async function fetchGlsl() {
  //fetch from static folder for dev pruposes
  const glsl = await Promise.all([
    fetch("glsl/common.glsl").then((res) => res.text()),
    fetch("glsl/sky.glsl").then((res) => res.text()),
  ]);
  return glsl;
}

export default function useGlsl() {
  const [glsl, setGlsl] = useState(null);

  useEffect(() => {
    fetchGlsl().then((glsl) => {
      setGlsl(glsl);
    });
  }, []);

  return glsl;
}
