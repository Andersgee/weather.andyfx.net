import { useState, useEffect } from "react";

async function fetchTextures() {
  //fetch from static folder for dev pruposes
  const textures = await Promise.all([
    fetch("textures/cloud3dtex2.uint8array").then((res) => res.arrayBuffer()),
    fetch("textures/cloud3dtex3.uint8array").then((res) => res.arrayBuffer()),
  ]);
  return textures;
}

export default function useTextures() {
  const [textures, setTextures] = useState(null);

  useEffect(() => {
    fetchTextures().then((textures) => {
      setTextures(textures);
    });
  }, []);

  return textures;
}
