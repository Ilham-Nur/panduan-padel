import { useEffect, useState } from "react";

type Orientation = "portrait" | "landscape";

function readOrientation(): Orientation {
  if (typeof window === "undefined") {
    return "portrait";
  }

  return window.matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait";
}

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>(() => readOrientation());

  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape)");
    const update = () => setOrientation(readOrientation());

    query.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return orientation;
}
