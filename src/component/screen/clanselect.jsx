import { useState } from "react";
import {BARON_FONT, PATHWAY_FONT} from "../../constant/assets.js";
import {FOND_IMG, CLAN_BTN_EAGLE, CLAN_BTN_JAGUAR, CLAN_BTN_SNAKE, CLAN_BTN_PIRANHA,
    HEX_PAYSAN, HEX_JAGUAR, HEX_EAGLE, HEX_PIRANHA, HEX_SNAKE,
    BTN_REJOINDRE} 
from "../../constant/assets.js";

const CLANS = [
  { idx: 0, key: "eagle",   color: "#3B82F6", hex: HEX_EAGLE,   btn: CLAN_BTN_EAGLE },
  { idx: 1, key: "jaguar",  color: "#EAB308", hex: HEX_JAGUAR,  btn: CLAN_BTN_JAGUAR },
  { idx: 2, key: "piranha", color: "#EF4444", hex: HEX_PIRANHA, btn: CLAN_BTN_PIRANHA },
  { idx: 3, key: "snake",   color: "#22C55E", hex: HEX_SNAKE,   btn: CLAN_BTN_SNAKE },
];

export default function ClanSelect({ onConfirm }) {
  var _pN = useState(""), pN = _pN[0], sPN = _pN[1];
  var _pC = useState(1),  pC = _pC[0], sPC = _pC[1];

  var clan = CLANS[pC >= 0 && pC <= 3 ? pC : 1];

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @font-face { font-family: 'PathwayGothic'; src: url('${PATHWAY_FONT}') format('truetype'); }
        @font-face { font-family: 'BaronNeue'; src: url('${BARON_FONT}') format('opentype'); }
      `}</style>

      <img src={FOND_IMG} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} alt="" />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 430, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 28px", boxSizing: "border-box", height: "100%", justifyContent: "flex-start" }}>

        {/* Titre */}
        <div style={{ width: "100%", background: "rgba(255,255,255,0.92)", padding: "14px 16px", textAlign: "center", marginBottom: 10, boxSizing: "border-box" }}>
          <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(16px,3.8vw,20px)", fontWeight: 400, color: "#111", letterSpacing: "0.13em" }}>
            choisissez votre clan
          </span>
        </div>

        {/* Hexagone du clan sélectionné */}
        <div style={{ width: "min(54vw,202px)", height: "min(54vw,202px)", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={clan.hex} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
        </div>

        {/* Médaillons de sélection */}
        <div style={{ display: "flex", gap: "clamp(12px,4.5vw,22px)", justifyContent: "center", marginBottom: 16 }}>
          {CLANS.map(function(cl) {
            var isSel = pC === cl.idx;
            return (
              <button key={cl.key} onClick={function() { sPC(cl.idx); }} style={{
                width: "clamp(65px,17vw,79px)", height: "clamp(65px,17vw,79px)",
                borderRadius: "50%", padding: 3,
                border: "2px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                transform: isSel ? "scale(1.2)" : "scale(1)",
                transition: "all .18s", flexShrink: 0,
              }}>
                <img src={cl.btn} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%", filter: isSel ? "none" : "brightness(0.75)" }} alt="" />
              </button>
            );
          })}
        </div>

        {/* Input nom */}
        <div style={{ width: "84%", maxWidth: 316, marginBottom: 16 }}>
          <input
            type="text"
            value={pN}
            onChange={function(e) { sPN(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter" && pN.trim()) onConfirm(pN.trim(), pC); }}
            placeholder="Votre nom de chef de clan"
            maxLength={20}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.81)",
              border: "2.5px solid " + clan.color,
              borderRadius: 8, padding: "12px 16px",
              fontSize: "clamp(15px,4.5vw,18px)", color: "#1a1a1a",
              fontFamily: "'BaronNeue','Black Ops One',serif",
              textAlign: "center", outline: "none", letterSpacing: "0.05em",
            }}
          />
        </div>

        {/* Bouton rejoindre */}
        <button
          onClick={function() { if (pN.trim()) onConfirm(pN.trim(), pC); }}
          style={{ background: "none", border: "none", cursor: pN.trim() ? "pointer" : "not-allowed", padding: 0, width: "74%", maxWidth: 288, opacity: pN.trim() ? 1 : 0.5 }}
        >
          <img src={BTN_REJOINDRE} style={{ width: "100%", display: "block" }} alt="Rejoindre" />
        </button>

      </div>
    </div>
  );
}
