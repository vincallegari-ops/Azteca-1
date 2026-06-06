import {BARON_FONT} from "../../constant/assets.js";
import {FOND_IMG, COIN_IMG, PARCHEMIN,BTN_BATAILLE,
    BLOC_EAGLE, BLOC_JAGUAR, BLOC_SNAKE, BLOC_PIRANHA,
    CLAN_BTN_EAGLE, CLAN_BTN_JAGUAR, CLAN_BTN_SNAKE, CLAN_BTN_PIRANHA,
    P_JOUEUR, P_CUAUH, P_HUITZ, P_IZTA, P_TLAL, P_QUETZ, P_MOCTE, P_NEZA, P_TLACA
} from "../../constant/assets.js";

const PORTRAIT_MAP = {
  "Huitz": P_HUITZ, "Tlaca": P_TLACA, "Mocte": P_MOCTE, "Itzco": P_ITZA,
  "Neza":  P_NEZA,  "Cuauh": P_CUAUH, "Coatl": P_TLAL,  "Quetzal": P_QUETZ,
};
const BLOC_MAP = {
  "#3B82F6": BLOC_EAGLE, "#EAB308": BLOC_JAGUAR, "#EF4444": BLOC_PIRANHA, "#22C55E": BLOC_SNAKE,
};
const CLANMDN_MAP = {
  "#3B82F6": CLAN_BTN_EAGLE, "#EAB308": CLAN_BTN_JAGUAR, "#EF4444": CLAN_BTN_PIRANHA, "#22C55E": CLAN_BTN_SNAKE,
};
const SHORT_DESC = {
  "Huitz":   "La Brute",
  "Tlaca":   "L'Ombre du pouvoir",
  "Mocte":   "Le Sage éternel",
  "Itzco":   "L'Implacable",
  "Neza":    "La Reine Serpent",
  "Cuauh":   "L'Esprit des Forêts",
  "Coatl":   "Le Traitre",
  "Quetzal": "Le Prince des cieux",
};

export default function Reveal({ rv, onStart }) {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0a0a0a" }}>
      <style>{`
        @font-face { font-family: 'BaronNeue'; src: url('${BARON_FONT}') format('opentype'); }
        @keyframes slideIn { from { transform: translateX(-120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <img src={FOND_IMG} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} alt="" />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", boxSizing: "border-box", height: "100%" }}>

        {/* Titre */}
        <div style={{ width: "100%", background: "rgba(255,255,255,0.92)", padding: "14px 16px", textAlign: "center", marginBottom: 28, boxSizing: "border-box" }}>
          <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(16px,3.8vw,20px)", color: "#111", letterSpacing: "0.13em" }}>
            vos adversaires se révèlent
          </span>
        </div>

        {/* Cartes joueurs */}
        <div style={{ width: "92%", display: "flex", flexDirection: "column", gap: 24 }}>
          {rv.map(function(p, i) {
            var portrait  = p.isHuman ? P_JOUEUR : (PORTRAIT_MAP[p.name] || P_HUITZ);
            var bloc      = BLOC_MAP[p.color]   || BLOC_JAGUAR;
            var medallion = CLANMDN_MAP[p.color] || CLAN_BTN_JAGUAR;
            var shortDesc = p.isHuman ? "Vous !" : (SHORT_DESC[p.name] || "");

            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                animation: "slideIn 0.5s ease forwards",
                animationDelay: (i * 500) + "ms",
                opacity: 0,
              }}>
                {/* Médaillon */}
                <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={medallion} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} alt="" />
                </div>

                {/* Bloc pierre + portrait */}
                <div style={{ flex: 1, position: "relative", height: 70 }}>
                  <img src={bloc} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }} alt="" />

                  {/* Portrait */}
                  <div style={{ position: "absolute", left: 0, top: -18, width: 86, height: 88, zIndex: 3 }}>
                    <img src={portrait} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} alt="" />
                  </div>

                  {/* Nom + description */}
                  <div style={{ position: "absolute", left: 96, top: 0, right: 16, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 4 }}>
                    <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(15px,4.5vw,18px)", color: "#111", letterSpacing: "0.1em", lineHeight: 1.1, marginTop: 6, display: "block" }}>
                      {p.name}
                    </span>
                    <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(9px,2.5vw,11px)", color: "#111", letterSpacing: "0.06em", marginTop: 2, display: "flex", alignItems: "center", width: "100%" }}>
                      <span style={{ flex: 1 }}>{shortDesc}</span>
                      {i === 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                          <span style={{ fontSize: "clamp(8px,2.2vw,10px)", color: "#111", fontFamily: "'BaronNeue','Black Ops One',serif", letterSpacing: "0.04em" }}>Bonus +2</span>
                          <img src={COIN_IMG} style={{ width: 13, height: 13, objectFit: "contain", flexShrink: 0 }} alt="" />
                        </span>
                      )}
                      {i === 1 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                          <span style={{ fontSize: "clamp(8px,2.2vw,10px)", color: "#111", fontFamily: "'BaronNeue','Black Ops One',serif", letterSpacing: "0.04em" }}>Bonus +1</span>
                          <img src={COIN_IMG} style={{ width: 13, height: 13, objectFit: "contain", flexShrink: 0 }} alt="" />
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton bataille */}
        <div style={{
          marginTop: 18, width: "88%", maxWidth: 360,
          animation: "slideIn 0.5s ease forwards",
          animationDelay: (rv.length * 500 + 500) + "ms",
          opacity: 0,
        }}>
          <div style={{ cursor: "pointer" }} onClick={onStart}>
            <img src={BTN_BATAILLE} style={{ width: "100%", display: "block" }} alt="Bataille" />
          </div>
        </div>

      </div>
    </div>
  );
}
