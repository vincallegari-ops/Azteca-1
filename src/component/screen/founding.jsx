import {BARON_FONT, PATHWAY_FONT} from "../../constant/assets.js";
import {FOND_IMG, COIN_IMG} from "../../constant/assets.js";

function CoinIcon({ size, ml, mr }) {
  var s = size || 14;
  return (
    <img src={COIN_IMG} style={{ width: s, height: s, objectFit: "contain", verticalAlign: "middle", display: "inline-block", marginLeft: ml || 0, marginRight: mr || 0 }} alt="or" />
  );
}

export default function Founding({ pl, isAnimating, sl, children }) {
  var humanIsWaiting = isAnimating;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0a0a0a" }}>
      
      <img src={FOND_IMG} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} alt="" />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", boxSizing: "border-box", height: "100%" }}>
      <style>{`
        @font-face { font-family: 'PathwayGothic'; src: url('${PATHWAY_FONT}') format('truetype'); }
        @font-face { font-family: 'BaronNeue'; src: url('${BARON_FONT}') format('opentype'); }
      `}</style>
        {/* Titre */}

        <div style={{ width: "100%", background: "rgba(255,255,255,0.92)", padding: "14px 16px", textAlign: "center", marginBottom: 28, boxSizing: "border-box" }}>
          <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(16px,3.8vw,20px)", color: "#111", letterSpacing: "0.13em" }}>
            fondez votre clan
          </span>
          {!humanIsWaiting && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
              <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(16px,3.8vw,20px)", color: "#111", fontWeight: 700 }}>
                {pl ? pl.gold : 12}
              </span>
              <CoinIcon size={18} />
            </div>
          )}
          {humanIsWaiting && (
            <div style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(10px,2.8vw,13px)", color: "#333", letterSpacing: "0.08em", marginTop: 4 }}>
              les autres joueurs fondent leur clan
            </div>
          )}
        </div>

        {/* Carte passée en children depuis App.jsx */}
        <div style={{ width: "96%", background: "transparent", padding: 2, boxSizing: "border-box", pointerEvents: humanIsWaiting ? "none" : "auto", opacity: humanIsWaiting ? 0.7 : 1 }}>
          {children}
        </div>

      </div>
    </div>
  );
}
