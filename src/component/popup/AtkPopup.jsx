import { useState, useEffect, useRef } from "react";
import {BARON_FONT, PATHWAY_FONT} from "../../constant/assets.js";
import { HEX_PAYSAN, HEX_JAGUAR, HEX_EAGLE, HEX_PIRANHA, HEX_SNAKE,
        BTN_ATK_EAGLE, BTN_ATK_JAGUAR, BTN_ATK_SNAKE, BTN_ATK_PIRANHA,
            BTN_ANNULER, BTN_CONFIRM }
from "../../constant/assets.js";

const HEX_MAP = {
  "#3B82F6": HEX_EAGLE,
  "#EAB308": HEX_JAGUAR,
  "#EF4444": HEX_PIRANHA,
  "#22C55E": HEX_SNAKE,
};
const ATK_BTN_MAP = {
  "#3B82F6": BTN_ATK_EAGLE,
  "#EAB308": BTN_ATK_JAGUAR,
  "#EF4444": BTN_ATK_PIRANHA,
  "#22C55E": BTN_ATK_SNAKE,
};

export default function AtkPopup({ tg, fr, pl, ps, diceResult, defB, onConfirm, onApply, onCancel, pendingBonus }) {
  var _localAnim = useState(false), localAnim = _localAnim[0], setLocalAnim = _localAnim[1];
  var _spinFrame = useState(0), spinFrame = _spinFrame[0], setSpinFrame = _spinFrame[1];

  var myColor = pl ? pl.color : "#3B82F6";
  var en = tg.owner !== null && tg.owner !== undefined && ps[tg.owner] ? ps[tg.owner] : null;
  var d = diceResult ? diceResult.dI : null;
  var myT = d ? d.myD1 + d.myD2 + (d.myBonus || 0) : 0;
  var won2 = d ? (d.neutral ? (myT > d.target) : (myT > (d.dR || 0))) : false;
  var spinDice = ["⚀","⚁","⚂","⚃","⚄","⚅"];

  var onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;

  var myHex  = HEX_MAP[myColor] || HEX_JAGUAR;
  var enHex  = en ? (HEX_MAP[en.color] || HEX_EAGLE) : HEX_PAYSAN;
  var atkBtn = ATK_BTN_MAP[myColor] || BTN_ATK_JAGUAR;
  var myName = pl ? pl.name : "Vous";

  var pb = pendingBonus || { eDefBonus: 0, eWallBonus: 0 };

  // Auto-apply après affichage du résultat
  useEffect(function() {
    if (!d || localAnim) return;
    var t = setTimeout(function() { onApplyRef.current(); }, 1700);
    return function() { clearTimeout(t); };
  }, [d, localAnim]);

  // Bloquer le scroll pendant le popup
  useEffect(function() {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return function() {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  // Spin interval pendant l'animation locale
  useEffect(function() {
    if (!localAnim) return;
    var t = setInterval(function() { setSpinFrame(function(f) { return f + 1; }); }, 120);
    return function() { clearInterval(t); };
  }, [localAnim]);

  function handleAttack() {
    setLocalAnim(true);
    onConfirm();
    setTimeout(function() { setLocalAnim(false); }, 2000);
  }

  return (
    <div className="anim-fade" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 997 }}>
      <style>{`@font-face { font-family: 'BaronNeue'; src: url('${BARON_FONT}') format('opentype'); }`}</style>
      <div style={{ position: "relative", maxWidth: 380, width: "95%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Hexagones */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", width: "100%", gap: 8, marginBottom: 0 }}>

          {/* Attaquant */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, minWidth: 0 }}>
            <div style={{ width: 130, height: 130 }}>
              <img src={myHex} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
            </div>
            <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: 17, color: myColor, textShadow: "0 0 3px #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000", marginTop: 2 }}>
              {(fr ? fr.name : myName).toLowerCase()}
            </span>
            <span style={{ fontFamily: "'PathwayGothic',serif", fontSize: 16, color: "#fff", fontWeight: 600 }}>
              {fr ? fr.army : 0} soldats
            </span>
          </div>

          {/* Défenseur */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, minWidth: 0 }}>
            <div style={{ width: 130, height: 130 }}>
              <img src={enHex} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
            </div>
            <span style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: 17, color: en ? en.color : "#94A3B8", textShadow: "0 0 3px #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000", marginTop: 2 }}>
              {tg.name ? tg.name.toLowerCase() : (en ? en.name.toLowerCase() : "tuile neutre")}
            </span>
            <span style={{ fontFamily: "'PathwayGothic',serif", fontSize: 16, color: "#fff", fontWeight: 600 }}>
              {tg.army} {en ? "soldats" : "paysans"}
            </span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, marginTop: 4, marginLeft: -40, width: "100%" }}>
              <span style={{ fontFamily: "'PathwayGothic',serif", fontSize: 13, color: "#fff" }}>
                Bonus/malus défenseur : {(function(val) {
                  if (!en && val > 0) return "0";
                  return val === 0 ? "0" : (val > 0 ? "+" : "") + val;
                })(d ? d.eDefBonus : pb.eDefBonus)}
              </span>
              <span style={{ fontFamily: "'PathwayGothic',serif", fontSize: 13, color: "#fff" }}>
                Bonus tour : {(function(val) { return val === 0 ? "0" : (val > 0 ? "+" : "") + val; })(d ? d.eWallBonus : pb.eWallBonus)}
              </span>
            </div>
          </div>
        </div>

        {/* Boutons — avant lancer */}
        {!localAnim && !d && (
          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 20, marginTop: 14, alignItems: "center", justifyContent: "center" }}>
            <div style={{ cursor: "pointer", width: 128 }} onClick={handleAttack}>
              <img src={atkBtn} style={{ width: "100%", display: "block" }} alt="Attaquer" />
            </div>
            <div style={{ cursor: "pointer", width: 88 }} onClick={onCancel}>
              <img src={BTN_ANNULER} style={{ width: "100%", display: "block" }} alt="Annuler" />
            </div>
          </div>
        )}

        {/* Phase dés */}
        {(localAnim || d) && (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 40 }}>
              {localAnim
                ? <span>{spinDice[spinFrame % 6]}{spinDice[(spinFrame + 3) % 6]}</span>
                : d && <span>{["⚀","⚁","⚂","⚃","⚄","⚅"][d.myD1 - 1]}{["⚀","⚁","⚂","⚃","⚄","⚅"][d.myD2 - 1]}</span>
              }
              <span style={{ color: "#64748B", fontSize: 24, alignSelf: "center" }}>vs</span>
              {localAnim
                ? <span>{spinDice[(spinFrame + 2) % 6]}{spinDice[(spinFrame + 5) % 6]}</span>
                : d && !d.neutral && <span>{["⚀","⚁","⚂","⚃","⚄","⚅"][(d.eD1 || 1) - 1]}{["⚀","⚁","⚂","⚃","⚄","⚅"][(d.eD2 || 1) - 1]}</span>
              }
              {!localAnim && d && d.neutral && (
                <span style={{ fontSize: 28, alignSelf: "center" }}>
                  {d.target <= 6
                    ? ["⚀","⚁","⚂","⚃","⚄","⚅"][d.target - 1]
                    : <span>{"⚅"}{["⚀","⚁","⚂","⚃","⚄","⚅"][Math.min(d.target - 6, 6) - 1]}</span>
                  }
                </span>
              )}
            </div>

            {/* Totaux */}
            {d && !localAnim && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 14, fontFamily: "monospace" }}>
                <span style={{ color: myColor }}><strong>{d.myD1 + d.myD2}</strong></span>
                <span style={{ color: "#64748B" }}>vs</span>
                {d.neutral
                  ? <span style={{ color: "#94A3B8" }}>
                      {d.totalBonus < 0
                        ? <>{d.target - d.totalBonus}<span style={{ color: "#94A3B8" }}> - {Math.abs(d.totalBonus)}</span>{" = "}<strong>{d.target}</strong></>
                        : <strong>{d.target}</strong>
                      }
                    </span>
                  : <span style={{ color: en ? en.color : "#94A3B8" }}>
                      {d.eD1 + d.eD2}
                      {d.totalBonus >= 0
                        ? <span> + {d.totalBonus}</span>
                        : <span> - {Math.abs(d.totalBonus)}</span>
                      }
                      {" = "}<strong>{d.dR}</strong>
                    </span>
                }
              </div>
            )}

            {d && !localAnim && (
              <div style={{ fontFamily: "'BaronNeue','Black Ops One',serif", fontSize: 16, color: myColor }}>
                {won2 ? "Victoire !" : "Défaite..."}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
