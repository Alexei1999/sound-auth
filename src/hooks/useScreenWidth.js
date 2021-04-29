import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setSize([window.innerWidth, window.innerHeight])
    );
    return () => {
      document.onresize = null;
    };
  }, []);

  return size;
};
