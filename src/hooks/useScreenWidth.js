import { useEffect, useState } from "react";

export const useScreenWidth = () => {
  const [width, setWidth] = useState();

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () => {
      document.onresize = null;
    };
  }, []);

  return width;
};
