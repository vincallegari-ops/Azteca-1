import {BARON_FONT} from "../../constant/assets.js";
import {FOND_IMG, BTN_NP, BTN_TU} from "../../constant/assets.js";

export default function Menu({ onNewGame, onTutorial }) {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000" }}>
      <style>{`@font-face { font-family: 'BaronNeue'; src: url('${BARON_FONT}') format('opentype'); }`}</style>

      <img
        src={FOND_IMG}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          zIndex: 0,
        }}
        alt=""
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.15)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: "40vh",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <button
          onClick={onNewGame}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: "72vw",
            maxWidth: 280,
            display: "block",
            lineHeight: 0,
            marginBottom: 20,
          }}
        >
          <img src={BTN_NP} style={{ width: "90%", display: "block", pointerEvents: "none" }} alt="Nouvelle partie" />
        </button>

        <button
          onClick={onTutorial}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: "72vw",
            maxWidth: 280,
            display: "block",
            lineHeight: 0,
          }}
        >
          <img src={BTN_TU} style={{ width: "90%", display: "block", pointerEvents: "none" }} alt="Tutoriel" />
        </button>
      </div>
    </div>
  );
}
