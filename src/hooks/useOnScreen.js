import { useState, useEffect } from "react";

export default function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  const isBrowser = typeof window !== "undefined";

  const observer =
    isBrowser &&
    new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
