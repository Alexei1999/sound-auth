import React, { useEffect } from "react";

import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegram } from "react-icons/fa";
import { AiOutlinePhone } from "react-icons/ai";
import { MdDialerSip } from "react-icons/md";
import { themes } from "src/constants/themes";

const iconProps = {
  style: { width: "40px", height: "40px" },
  color: "var(--primary-color)",
};

const icons = {
  jsm: <AiOutlinePhone {...iconProps} />,
  telegram: (
    <span
      style={{
        backgroundColor: "white",
        display: "inline-block",
        borderRadius: "9999px",
        height: "37px",
        width: "37px",
      }}
    >
      <FaTelegram
        style={{ ...iconProps.style, margin: "-1px 0 0 -1px" }}
        color="#0088CC"
      />
    </span>
  ),
  whatsup: <IoLogoWhatsapp {...iconProps} color="#25D366" />,
  sip: <MdDialerSip {...iconProps} />,
};

export function MenuIcon({ selected }) {
  useEffect(() => {
    const theme = themes[selected] || "saga-blue";
    const element = document.getElementById("theme-link");
    const currentTheme = element?.href
      ?.match(/(?<=\/themes\/).*(?=\/theme.css)/)
      ?.toString();

    if (theme !== currentTheme)
      element.href = element.href?.replace(currentTheme, theme);
  }, [selected]);

  if (!icons[selected]) return null;

  return icons[selected];
}
