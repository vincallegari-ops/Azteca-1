import { useEffect } from "react";

import {ACCUEIL_IMG} from "../../constant/assets.js";

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <img
        src={ACCUEIL_IMG}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        alt=""
      />
    </div>
  );
}