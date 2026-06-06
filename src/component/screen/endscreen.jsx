import {BARON_FONT} from "../../constant/assets.js";

export default function EndScreen({ sc, onReplay }) {
  var w   = sc[0];
  var iW  = w && w.idx === 0;

  return (
    <div style={{ height: "100%", background: "linear-gradient(170deg,#080C18 0%,#0F172A 40%,#151D2E 100%)", color: "#E2E8F0", fontFamily: "'Crimson Text',Georgia,serif" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "45px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 10 }}>{iW ? "👑" : "💀"}</div>
        <h1 style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: 28, color: iW ? "#FCD34D" : "#EF4444", marginBottom: 6 }}>
          {iW ? "VICTOIRE !" : "DÉFAITE..."}
        </h1>
        {/* Classement */}
        <div style={{ background: "transparent", borderRadius: 12, padding: "12px 16px", textAlign: "left", border: "1px solid #334155", marginBottom: 16 }}>
          {sc.map(function(s, rk) {
            return (
              <div key={s.idx} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 8, background: s.idx === 0 ? "#3B82F611" : "transparent" }}>
                <span style={{ fontWeight: 900, fontSize: 16, color: rk === 0 ? "#FCD34D" : "#475569", width: 24 }}>
                  {rk === 0 ? "🥇" : rk === 1 ? "🥈" : rk === 2 ? "🥉" : "4."}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.name}</div>
                </div>
                <div style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontWeight: 900, fontSize: 22, color: "#FCD34D" }}>
                  {s.score}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton rejouer */}
        <button
          onClick={onReplay}
          style={{ background: "linear-gradient(135deg,#D97706,#B45309)", color: "#FFF", border: "none", padding: "12px 36px", borderRadius: 12, fontSize: 15, fontFamily: "'BaronNeue','Black Ops One',serif", fontWeight: 700, cursor: "pointer" }}
        >
          Rejouer
        </button>

      </div>
    </div>
  );
}
