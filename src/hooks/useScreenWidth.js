import { useEffect, useState } from "react";

export const useScreenWidth = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () => {
      document.onresize = null;
    };
  }, []);

  return width;
};
