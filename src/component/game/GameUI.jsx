import {BARON_FONT, PATHWAY_FONT} from "../../constant/assets.js";
import {FOND_IMG, SOLEIL_AZTEC, PARCHEMIN, COMPTEUR_OR,
     BTN_QUITTER, BTN_REGLES, BTN_PASSER, 
    IMG_TOUR, IMB_BANQUE, IMG_CASERNE,
    BLOC_EAGLE, BLOC_JAGUAR, BLOC_SNAKE, BLOC_PIRANHA,
    P_JOUEUR, P_CUAUH, P_HUITZ, P_IZTA, P_TLAL, P_QUETZ, P_MOCTE, P_NEZA, P_TLACA,
    CLAN_BTN_EAGLE, CLAN_BTN_JAGUAR, CLAN_BTN_SNAKE, CLAN_BTN_PIRANHA
} 
from "../../constant/assets.js";

const BLOC_MAP = { "#3B82F6": BLOC_EAGLE, "#EAB308": BLOC_JAGUAR, "#EF4444": BLOC_PIRANHA, "#22C55E": BLOC_SNAKE };
const CLANMDN  = { "#3B82F6": CLAN_BTN_EAGLE, "#EAB308": CLAN_BTN_JAGUAR, "#EF4444": CLAN_BTN_PIRANHA, "#22C55E": CLAN_BTN_SNAKE };
const PORT_MAP = { "Huitz": P_HUITZ, "Tlaca": P_TLACA, "Mocte": P_MOCTE, "Itzco": P_ITZA, "Neza": P_NEZA, "Cuauh": P_CUAUH, "Coatl": P_TLAL, "Quetzal": P_QUETZ };

const MAX_TURNS = 15;

// ── Partie HAUTE : tour + blocs personnages ───────────────────────────────────
export function GameUITop({ tn, ps, ti, pl, playOrder, gP, isAnimating, curAiAction, scores, onTutorial, onQuit }) {
  var leaderIdx = scores.length > 0 ? scores[0].idx : -1;

  return (
    <div>
      <style>{`
        @font-face { font-family: 'BaronNeue';     src: url('${BARON_FONT}')   format('opentype'); }
        @font-face { font-family: 'PathwayGothic'; src: url('${PATHWAY_FONT}') format('truetype'); }
      `}</style>

      {/* Ligne tour + boutons */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px 4px" }}>
        <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontWeight: 400, fontSize: "clamp(14px,4vw,18px)", color: "#111", letterSpacing: "0.1em", flexShrink: 0, background: "linear-gradient(to right, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0))", padding: "4px 24px 4px 8px", borderRadius: 4 }}>
          Tour {tn}/{MAX_TURNS}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ cursor: "pointer", width: "clamp(72px,20vw,100px)", flexShrink: 0 }} onClick={function(){sPh("tutorial_ingame");}}>
          <img src={BTN_REGLES} style={{ width: "100%", display: "block" }} alt="Règles" />
        </div>
        <div style={{ cursor: "pointer", width: "clamp(72px,20vw,100px)", flexShrink: 0 }} onClick={onQuit}>
          <img src={BTN_QUITTER} style={{ width: "100%", display: "block" }} alt="Quitter" />
        </div>
      </div>

      {/* Blocs personnages */}
      <div style={{ display: "flex", gap: 2, padding: "11px 4px 0" }}>
        {playOrder.map(function(pidx) {
          var p = ps[pidx]; if (!p) return null;
          var il    = ti.filter(function(x) { return x.owner === pidx; });
          var score = il.reduce(function(s, x) { return s + x.size; }, 0);
          var isCurrent = isAnimating ? (curAiAction && curAiAction.color === p.color) : (gP !== "done" && pidx === 0);
          var isLeader  = pidx === leaderIdx;
          var bloc      = BLOC_MAP[p.color]  || BLOC_JAGUAR;
          var medallion = CLANMDN[p.color]   || CLAN_BTN_JAGUAR;
          var portrait  = p.isHuman ? P_JOUEUR : (PORT_MAP[p.name] || P_HUITZ);
          var blocH = 24, mdSize = 28, portSize = 48;

          return (
            <div key={pidx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", opacity: isCurrent ? 1 : 0.4, transition: "opacity 0.3s", minWidth: 0, padding: "0 1px" }}>
              <div style={{ position: "relative", width: "100%", height: portSize, marginBottom: -5, zIndex: 4 }}>
                <div style={{ position: "absolute", left: "calc(50% - 6px)", transform: "translateX(-50%)", bottom: 0, width: portSize, height: portSize, zIndex: 4 }}>
                  <img src={portrait} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} alt="" />
                </div>
                <div style={{ position: "absolute", bottom: -4, right: 0, width: mdSize, height: mdSize, borderRadius: "50%", zIndex: 5 }}>
                  <img src={medallion} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} alt="" />
                </div>
              </div>
              <div style={{ position: "relative", width: "100%", height: blocH, zIndex: 3 }}>
                <img src={bloc} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }} alt="" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 4px 2px", zIndex: 3 }}>
                  <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(11px,3.2vw,14px)", color: "#111", letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "lowercase", textAlign: "center" }}>
                    {p.name}
                  </span>
                </div>
              </div>
              <div style={{ position: "relative", width: "70%", marginTop: -3, zIndex: 2 }}>
                {isLeader && (
                  <div style={{ position: "absolute", top: "50%", left: -10, transform: "translateY(-50%)", zIndex: 6, width: 20, height: 20, pointerEvents: "none" }}>
                    <img src={SOLEIL_AZTEC} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
                  </div>
                )}
                <img src={PARCHEMIN} style={{ width: "100%", display: "block" }} alt="" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(9px,2.4vw,11px)", color: "#111", letterSpacing: "0.04em" }}>
                    {score} pts
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Partie BASSE : bandeau événement + panneaux action ────────────────────────
export function GameUIBottom({ tn, ps, ti, pl, gP, aCt, sl, isAnimating, phaseReady, displayPlayer, displayMsg, onPassAttack, onBuild, onEndTurn }) {
  var si2   = sl !== null ? ti[sl] : null;
  var iM    = si2 && si2.owner === 0 && !si2.isDesert;
  var maxAtk = tn === 1 ? 1 : 2;

  var bO = [];
  if (si2 && iM && gP === "build" && !si2.bType) {
    if (!si2.wall     && pl.gold >= 5) bO.push({ t: "wall",     img: IMG_TOUR,    cost: 5 });
    if (!si2.barracks && pl.gold >= 8) bO.push({ t: "barracks", img: IMG_CASERNE, cost: 8 });
    if (!si2.bank     && pl.gold >= 8) bO.push({ t: "bank",     img: IMG_BANQUE,  cost: 8 });
  }

  return (
    <div>
      {/* Bandeau événement */}
      {displayPlayer && (
        <div style={{ display: "flex", alignItems: "center", padding: "4px 8px", gap: 0, width: "100%", boxSizing: "border-box", opacity: displayMsg ? 1 : 0.3, transition: "opacity 0.2s", minHeight: 52 }}>
          <div style={{ position: "relative", width: 48, height: 52, flexShrink: 0, marginRight: -10, zIndex: 3 }}>
            <img src={displayPlayer.isHuman ? P_JOUEUR : (PORT_MAP[displayPlayer.name] || P_HUITZ)} style={{ position: "absolute", bottom: 0, left: 0, width: 48, height: 52, objectFit: "contain", objectPosition: "bottom" }} alt="" />
            <img src={CLANMDN[displayPlayer.color] || CLAN_BTN_JAGUAR} style={{ position: "absolute", bottom: 0, right: -4, width: 22, height: 22, objectFit: "contain", borderRadius: "50%" }} alt="" />
          </div>
          <div style={{ position: "relative", flex: 1, height: 44, zIndex: 2 }}>
            <img src={PARCHEMIN} style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} alt="" />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", left: 15, padding: "0 28px" }}>
              <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: "clamp(8px,2.8vw,13px)", color: "#2a1a00", letterSpacing: "0.04em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayMsg}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Panneaux action */}
      <div style={{ display: "flex", gap: 8, padding: "6px 4px 4px", alignItems: "flex-start" }}>

        {/* BLOC ATTAQUE */}
        <div style={{ flex: 1, position: "relative", transition: "opacity .3s", marginTop: 5, opacity: gP === "attack" && !isAnimating ? 1 : 0.35 }}>
          <img src={BLOC_ATTAQUE} style={{ width: "100%", display: "block" }} alt="" />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", padding: "18% 6% 6% 14%" }}>
            {gP === "attack" && !isAnimating && (
              <div style={{ fontFamily: "'PathwayGothic',serif", fontSize: "clamp(9px,2.5vw,12px)", color: "#fff" }}>
                Sélectionnez une de vos tuiles
              </div>
            )}
            {gP === "attack" && tn <= 4 && (
              <div style={{ fontFamily: "'PathwayGothic',serif", fontSize: "clamp(9px,2.5vw,12px)", color: "#fff", marginTop: "4%" }}>
                Attaque entre joueurs interdite avant le tour 5
              </div>
            )}
            {gP !== "attack" && (
              <div style={{ fontFamily: "'PathwayGothic',serif", fontSize: "clamp(8px,2vw,10px)", color: "#d6a00aff" }}>En attente</div>
            )}
            <div style={{ marginTop: "auto", fontFamily: "'PathwayGothic',serif", fontSize: "clamp(12px,3.5vw,16px)", color: "#111", fontWeight: 700 }}>
              {gP === "attack" && <span>Action {aCt === 0 ? 1 : 2}/{maxAtk}</span>}
            </div>
          </div>
          {gP === "attack" && (
            <div style={{ position: "absolute", bottom: "4%", right: "7%", width: "38%", cursor: "pointer", zIndex: 5 }} onClick={onPassAttack}>
              <img src={BTN_PASSER} style={{ width: "100%", display: "block" }} alt="Passer" />
            </div>
          )}
        </div>

        {/* BLOC CONSTRUCTION */}
        <div style={{ flex: 1, position: "relative", transition: "opacity .3s", opacity: gP === "build" ? 1 : 0.35 }}>
          <img src={BLOC_CONST} style={{ width: "100%", display: "block" }} alt="" />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "8px 10px 14px" }}>
            {gP === "build" && si2 && iM && !si2.bType && bO.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, justifyContent: "flex-start", marginTop: 14 }}>
                {bO.map(function(b) {
                  return (
                    <div key={b.t} onClick={function() { onBuild(sl, b.t); }} style={{ cursor: "pointer", width: "60%" }}>
                      <img src={b.img} style={{ width: "100%", display: "block" }} alt={b.t} />
                    </div>
                  );
                })}
              </div>
            )}
            {gP === "build" && si2 && si2.bType && (
              <div style={{ fontFamily: "'PathwayGothic',serif", fontSize: "clamp(11px,3.2vw,14px)", color: "#333", flex: 1, display: "flex", alignItems: "center" }}>
                🔨 En cours ({si2.bTurns} tour{si2.bTurns > 1 ? "s" : ""})
              </div>
            )}
            {gP === "build" && !si2 && (
              <div style={{ fontFamily: "'PathwayGothic',serif", fontSize: "clamp(9px,2.5vw,11px)", color: "#fff", flex: 1, display: "flex", alignItems: "left", paddingLeft: 10, marginTop: 20 }}>
                Sélectionnez une tuile
              </div>
            )}
            {gP !== "build" && (
              <div style={{ fontFamily: "'PathwayGothic',serif", fontSize: "clamp(9px,2.5vw,11px)", color: "#fff", flex: 1, display: "flex", alignItems: "center" }}>
                En attente
              </div>
            )}
          </div>
          {gP === "build" && phaseReady && (
            <div style={{ position: "absolute", bottom: 0, right: 9, width: "clamp(50px,15.8vw,77px)", cursor: "pointer", zIndex: 5 }} onClick={onEndTurn}>
              <div style={{ position: "relative", bottom: "100%", marginBottom: 5, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ position: "relative", width: 42, height: 42 }}>
                  <img src={COMPTEUR_OR} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: 14, color: "#111", fontWeight: 700, marginLeft: -18, marginBottom: -1, marginTop: -1 }}>
                    {pl ? pl.gold : 0}
                  </span>
                </div>
              </div>
              <img src={BTN_PASSER} style={{ width: "100%", display: "block" }} alt="Passer" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Export default pour compatibilité (tout en un) ────────────────────────────
export default function GameUI(props) {
  return (
    <>
      <GameUITop {...props} />
      <GameUIBottom {...props} />
    </>
  );
}
