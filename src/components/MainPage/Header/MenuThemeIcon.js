import React, { useEffect } from "react";

import { SiWebrtc } from "react-icons/si";
import { FaTelegram } from "react-icons/fa";
import { AiOutlinePhone } from "react-icons/ai";
import { MdDialerSip } from "react-icons/md";
import { themes } from "src/constants/themes";

const iconProps = {
  size: "40px",
  color: "var(--primary-color)",
};

const icons = (props) => ({
  jsm: <AiOutlinePhone {...iconProps} {...props} />,
  telegram: (
    <span
      style={{
        backgroundColor: "white",
        display: "inline-block",
        borderRadius: "9999px",
        height: "37px",
        width: "37px",
      }}
      {...props}
    >
      <FaTelegram
        {...iconProps}
        style={{ margin: "-1px 0 0 -1px" }}
        color="#0088CC"
        {...props}
      />
    </span>
  ),
  WebRTC: (
    <span style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          backgroundColor: "var(--primary-color)",
          display: "inline-block",
          right: "9px",
          height: "23px",
          width: "23px",
          top: "12px",
        }}
      />
      <SiWebrtc
        {...iconProps}
        style={{
          position: "relative",
        }}
        color={null}
      />
    </span>
  ),
  sip: <MdDialerSip {...iconProps} {...props} />,
});

export function MenuThemeIcon({ selected, ...props }) {
  useEffect(() => {
    const theme = themes[selected] || "saga-blue";
    const element = document.getElementById("theme-link");
    // @ts-ignore
    const currentTheme = element?.href
      ?.match(/(?<=\/themes\/).*(?=\/theme.css)/)
      ?.toString();

    if (theme !== currentTheme)
      // @ts-ignore
      element.href = element.href?.replace(currentTheme, theme);
  }, [selected]);

  if (!icons(props)[selected]) return null;

  return icons(props)[selected];
}
